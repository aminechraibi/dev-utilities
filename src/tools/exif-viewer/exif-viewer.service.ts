const IFD0_TAGS: Record<number, string> = {
  0x010E: 'ImageDescription',
  0x010F: 'Make',
  0x0110: 'Model',
  0x0112: 'Orientation',
  0x011A: 'XResolution',
  0x011B: 'YResolution',
  0x0128: 'ResolutionUnit',
  0x0131: 'Software',
  0x0132: 'DateTime',
  0x013B: 'Artist',
  0x8298: 'Copyright',
};

const EXIF_SUB_TAGS: Record<number, string> = {
  0x829A: 'ExposureTime',
  0x829D: 'FNumber',
  0x8822: 'ExposureProgram',
  0x8827: 'ISOSpeedRatings',
  0x9000: 'ExifVersion',
  0x9003: 'DateTimeOriginal',
  0x9004: 'DateTimeDigitized',
  0x9201: 'ShutterSpeedValue',
  0x9202: 'ApertureValue',
  0x9203: 'BrightnessValue',
  0x9204: 'ExposureBiasValue',
  0x9205: 'MaxApertureValue',
  0x9206: 'SubjectDistance',
  0x9207: 'MeteringMode',
  0x9208: 'LightSource',
  0x9209: 'Flash',
  0x920A: 'FocalLength',
  0x9286: 'UserComment',
  0xA001: 'ColorSpace',
  0xA002: 'PixelXDimension',
  0xA003: 'PixelYDimension',
  0xA402: 'ExposureMode',
  0xA403: 'WhiteBalance',
  0xA404: 'DigitalZoomRatio',
  0xA405: 'FocalLengthIn35mmFilm',
  0xA406: 'SceneCaptureType',
  0xA430: 'CameraOwnerName',
  0xA431: 'BodySerialNumber',
  0xA433: 'LensMake',
  0xA434: 'LensModel',
  0xA435: 'LensSerialNumber',
};

const GPS_TAGS: Record<number, string> = {
  0x0001: 'GPSLatitudeRef',
  0x0002: 'GPSLatitude',
  0x0003: 'GPSLongitudeRef',
  0x0004: 'GPSLongitude',
  0x0005: 'GPSAltitudeRef',
  0x0006: 'GPSAltitude',
  0x0007: 'GPSTimeStamp',
  0x0012: 'GPSMapDatum',
  0x001D: 'GPSDateStamp',
};

const TYPE_SIZES = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8];

function readEntryValue(
  view: DataView,
  entry: number,
  tiffStart: number,
  le: boolean,
): string | null {
  const type = view.getUint16(entry + 2, le);
  const count = view.getUint32(entry + 4, le);

  if (type === 0 || type >= TYPE_SIZES.length || count === 0 || count > 100000) {
    return null;
  }

  const byteSize = TYPE_SIZES[type] * count;
  const valueStart = byteSize <= 4 ? entry + 8 : tiffStart + view.getUint32(entry + 8, le);

  if (valueStart + byteSize > view.byteLength) {
    return null;
  }

  if (type === 2) {
    let s = '';
    for (let j = 0; j < count; j++) {
      const c = view.getUint8(valueStart + j);
      if (c === 0) {
        break;
      }
      s += String.fromCharCode(c);
    }
    return s.trim() || null;
  }

  if (type === 7) {
    if (count > 8) {
      return `[${count} bytes]`;
    }
    return Array.from({ length: count }, (_, i) =>
      view.getUint8(valueStart + i).toString(16).padStart(2, '0'),
    ).join(' ');
  }

  if (type === 5 || type === 10) {
    const results: string[] = [];
    for (let i = 0; i < Math.min(count, 4); i++) {
      const off = valueStart + i * 8;
      const num = type === 5 ? view.getUint32(off, le) : view.getInt32(off, le);
      const den = type === 5 ? view.getUint32(off + 4, le) : view.getInt32(off + 4, le);
      results.push(den === 0 ? String(num) : `${(num / den).toFixed(4)}`);
    }
    return results.join(', ');
  }

  if (type === 3) {
    if (count === 1) {
      return String(view.getUint16(valueStart, le));
    }
    return Array.from({ length: Math.min(count, 8) }, (_, i) =>
      view.getUint16(valueStart + i * 2, le),
    ).join(', ');
  }

  if (type === 4) {
    if (count === 1) {
      return String(view.getUint32(valueStart, le));
    }
    return Array.from({ length: Math.min(count, 8) }, (_, i) =>
      view.getUint32(valueStart + i * 4, le),
    ).join(', ');
  }

  if (type === 9) {
    return String(view.getInt32(valueStart, le));
  }

  return null;
}

function readIFD(
  view: DataView,
  ifdOffset: number,
  tiffStart: number,
  le: boolean,
  tagMap: Record<number, string>,
  result: Record<string, string>,
) {
  if (ifdOffset + 2 > view.byteLength) {
    return;
  }
  const count = view.getUint16(ifdOffset, le);
  if (count > 512) {
    return;
  }

  for (let i = 0; i < count; i++) {
    const entry = ifdOffset + 2 + i * 12;
    if (entry + 12 > view.byteLength) {
      break;
    }
    const tag = view.getUint16(entry, le);
    const name = tagMap[tag];
    if (!name) {
      continue;
    }
    try {
      const val = readEntryValue(view, entry, tiffStart, le);
      if (val !== null) {
        result[name] = val;
      }
    }
    catch { /* skip broken entry */ }
  }
}

function getSubIFDOffset(
  view: DataView,
  ifdOffset: number,
  tiffStart: number,
  le: boolean,
  pointerTag: number,
): number | null {
  if (ifdOffset + 2 > view.byteLength) {
    return null;
  }
  const count = view.getUint16(ifdOffset, le);
  for (let i = 0; i < count; i++) {
    const entry = ifdOffset + 2 + i * 12;
    if (entry + 12 > view.byteLength) {
      break;
    }
    if (view.getUint16(entry, le) === pointerTag) {
      return tiffStart + view.getUint32(entry + 8, le);
    }
  }
  return null;
}

export interface ParsedExif {
  camera: Record<string, string>
  exposure: Record<string, string>
  gps: Record<string, string>
}

export async function extractExif(buffer: ArrayBuffer): Promise<ParsedExif> {
  const view = new DataView(buffer);

  if (view.byteLength < 4 || view.getUint16(0) !== 0xFFD8) {
    throw new Error('Not a JPEG file');
  }

  const camera: Record<string, string> = {};
  const exposure: Record<string, string> = {};
  const gps: Record<string, string> = {};
  let offset = 2;

  while (offset < view.byteLength - 4) {
    const marker = view.getUint16(offset);

    if (marker === 0xFFE1) {
      const segLen = view.getUint16(offset + 2);
      const h = String.fromCharCode(
        view.getUint8(offset + 4),
        view.getUint8(offset + 5),
        view.getUint8(offset + 6),
        view.getUint8(offset + 7),
      );

      if (h === 'Exif') {
        const tiffStart = offset + 10;
        if (tiffStart + 8 > view.byteLength) {
          throw new Error('EXIF segment truncated');
        }

        const byteOrder = view.getUint16(tiffStart);
        if (byteOrder !== 0x4949 && byteOrder !== 0x4D4D) {
          throw new Error('Invalid TIFF byte order');
        }
        const le = byteOrder === 0x4949;

        const ifd0 = tiffStart + view.getUint32(tiffStart + 4, le);

        readIFD(view, ifd0, tiffStart, le, IFD0_TAGS, camera);

        const exifSubOffset = getSubIFDOffset(view, ifd0, tiffStart, le, 0x8769);
        if (exifSubOffset !== null) {
          readIFD(view, exifSubOffset, tiffStart, le, EXIF_SUB_TAGS, exposure);
        }

        const gpsOffset = getSubIFDOffset(view, ifd0, tiffStart, le, 0x8825);
        if (gpsOffset !== null) {
          readIFD(view, gpsOffset, tiffStart, le, GPS_TAGS, gps);
        }

        const total = Object.keys(camera).length + Object.keys(exposure).length + Object.keys(gps).length;
        if (total === 0) {
          throw new Error('EXIF segment found but contained no readable tags');
        }

        return { camera, exposure, gps };
      }

      offset += 2 + segLen;
    }
    else if ((marker & 0xFF00) === 0xFF00 && marker !== 0xFFFF) {
      const segLen = view.getUint16(offset + 2);
      offset += 2 + segLen;
    }
    else {
      break;
    }
  }

  throw new Error('No EXIF data found — image may not contain EXIF metadata');
}
