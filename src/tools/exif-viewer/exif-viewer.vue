<script setup lang="ts">
import { extractExif } from './exif-viewer.service';
import type { ParsedExif } from './exif-viewer.service';
import CameraIcon from '~icons/mdi/camera';
import ApertureIcon from '~icons/mdi/camera-iris';
import MapMarkerIcon from '~icons/mdi/map-marker';
import ImageIcon from '~icons/mdi/image-outline';

const exifData = ref<ParsedExif | null>(null);
const generalInfo = ref<{ name: string; size: string; type: string; dimensions?: string } | null>(null);
const exifMissing = ref(false);
const error = ref('');
const loading = ref(false);

const CAMERA_LABELS: Record<string, string> = {
  ImageDescription: 'Description',
  Make: 'Make',
  Model: 'Model',
  Software: 'Software',
  DateTime: 'Date / Time',
  Artist: 'Artist',
  Copyright: 'Copyright',
  Orientation: 'Orientation',
  XResolution: 'X Resolution',
  YResolution: 'Y Resolution',
  ResolutionUnit: 'Resolution Unit',
};

const EXPOSURE_LABELS: Record<string, string> = {
  DateTimeOriginal: 'Date Taken',
  DateTimeDigitized: 'Date Digitized',
  ExposureTime: 'Exposure Time',
  FNumber: 'Aperture',
  ISOSpeedRatings: 'ISO',
  FocalLength: 'Focal Length',
  FocalLengthIn35mmFilm: '35mm Equivalent',
  ExposureProgram: 'Exposure Program',
  ExposureBiasValue: 'Exposure Bias',
  ExposureMode: 'Exposure Mode',
  MeteringMode: 'Metering Mode',
  Flash: 'Flash',
  WhiteBalance: 'White Balance',
  LightSource: 'Light Source',
  ShutterSpeedValue: 'Shutter Speed (APEX)',
  ApertureValue: 'Aperture (APEX)',
  BrightnessValue: 'Brightness',
  MaxApertureValue: 'Max Aperture',
  SubjectDistance: 'Subject Distance',
  DigitalZoomRatio: 'Digital Zoom',
  SceneCaptureType: 'Scene Type',
  ColorSpace: 'Color Space',
  PixelXDimension: 'Width',
  PixelYDimension: 'Height',
  ExifVersion: 'EXIF Version',
  UserComment: 'Comment',
  CameraOwnerName: 'Camera Owner',
  BodySerialNumber: 'Body Serial',
  LensMake: 'Lens Make',
  LensModel: 'Lens Model',
  LensSerialNumber: 'Lens Serial',
};

const GPS_LABELS: Record<string, string> = {
  GPSAltitudeRef: 'Altitude Ref',
  GPSAltitude: 'Altitude',
  GPSTimeStamp: 'Time (UTC)',
  GPSDateStamp: 'Date',
  GPSMapDatum: 'Map Datum',
};

function formatValue(key: string, val: string): string {
  switch (key) {
    case 'ExposureTime': {
      const n = Number.parseFloat(val);
      if (Number.isNaN(n)) {
        return val;
      }
      if (n >= 1) {
        return `${n.toFixed(1)} s`;
      }
      return `1/${Math.round(1 / n)} s`;
    }
    case 'FNumber': {
      const n = Number.parseFloat(val);
      return Number.isNaN(n) ? val : `f/${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}`;
    }
    case 'FocalLength': {
      const n = Number.parseFloat(val);
      return Number.isNaN(n) ? val : `${Math.round(n)} mm`;
    }
    case 'FocalLengthIn35mmFilm':
      return `${val} mm`;
    case 'ExposureBiasValue': {
      const n = Number.parseFloat(val);
      if (Number.isNaN(n)) {
        return val;
      }
      return `${n >= 0 ? '+' : ''}${n.toFixed(1)} EV`;
    }
    case 'ApertureValue':
    case 'MaxApertureValue': {
      const n = Number.parseFloat(val);
      if (Number.isNaN(n)) {
        return val;
      }
      const fnum = Math.SQRT2 ** n;
      return `f/${fnum.toFixed(1)}`;
    }
    case 'SubjectDistance': {
      const n = Number.parseFloat(val);
      return Number.isNaN(n) ? val : `${n.toFixed(2)} m`;
    }
    case 'DigitalZoomRatio': {
      const n = Number.parseFloat(val);
      return Number.isNaN(n) ? val : n === 0 ? 'Not used' : `${n.toFixed(1)}×`;
    }
    case 'XResolution':
    case 'YResolution':
      return `${Math.round(Number.parseFloat(val))} dpi`;
    case 'PixelXDimension':
    case 'PixelYDimension':
      return `${val} px`;
    case 'Orientation': {
      const map: Record<string, string> = {
        1: 'Normal',
        2: 'Mirrored horizontal',
        3: 'Rotated 180°',
        4: 'Mirrored vertical',
        5: 'Mirrored H + rotated 90° CCW',
        6: 'Rotated 90° CW',
        7: 'Mirrored H + rotated 90° CW',
        8: 'Rotated 90° CCW',
      };
      return map[val] ?? val;
    }
    case 'ResolutionUnit': {
      const map: Record<string, string> = { 1: 'No unit', 2: 'inch', 3: 'cm' };
      return map[val] ?? val;
    }
    case 'ColorSpace':
      return val === '1' ? 'sRGB' : val === '65535' ? 'Uncalibrated' : val;
    case 'Flash': {
      const n = Number.parseInt(val);
      if (Number.isNaN(n)) {
        return val;
      }
      const fired = n & 0x01;
      const returnBit = (n >> 1) & 0x03;
      const mode = (n >> 3) & 0x03;
      const parts: string[] = [fired ? 'Flash fired' : 'No flash'];
      if (fired && returnBit === 2) {
        parts.push('no strobe return');
      }
      if (fired && returnBit === 3) {
        parts.push('strobe return');
      }
      if (mode === 1) {
        parts.push('compulsory');
      }
      if (mode === 2) {
        parts.push('auto');
      }
      if ((n >> 5) & 1) {
        parts.push('red-eye reduction');
      }
      return parts.join(', ');
    }
    case 'ExposureProgram': {
      const modes = ['Not defined', 'Manual', 'Normal auto', 'Aperture-priority', 'Shutter-priority', 'Creative', 'Action', 'Portrait', 'Landscape'];
      return modes[Number.parseInt(val)] ?? val;
    }
    case 'MeteringMode': {
      const modes = ['Unknown', 'Average', 'Center-weighted average', 'Spot', 'Multi-spot', 'Pattern', 'Partial'];
      return modes[Number.parseInt(val)] ?? val;
    }
    case 'WhiteBalance':
      return val === '0' ? 'Auto' : val === '1' ? 'Manual' : val;
    case 'ExposureMode':
      return val === '0' ? 'Auto' : val === '1' ? 'Manual' : val === '2' ? 'Auto bracket' : val;
    case 'LightSource': {
      const map: Record<string, string> = {
        0: 'Unknown',
        1: 'Daylight',
        2: 'Fluorescent',
        3: 'Tungsten (incandescent)',
        4: 'Flash',
        9: 'Fine weather',
        10: 'Cloudy weather',
        11: 'Shade',
        12: 'Daylight fluorescent',
        13: 'Day white fluorescent',
        14: 'Cool white fluorescent',
        15: 'White fluorescent',
        17: 'Standard light A',
        18: 'Standard light B',
        19: 'Standard light C',
        255: 'Other',
      };
      return map[val] ?? val;
    }
    case 'SceneCaptureType': {
      const types = ['Standard', 'Landscape', 'Portrait', 'Night scene'];
      return types[Number.parseInt(val)] ?? val;
    }
    case 'GPSAltitudeRef':
      return val === '0' ? 'Above sea level' : 'Below sea level';
    case 'GPSAltitude': {
      const n = Number.parseFloat(val);
      return Number.isNaN(n) ? val : `${n.toFixed(1)} m`;
    }
    case 'ExifVersion': {
      try {
        const bytes = val.split(' ').map(b => Number.parseInt(b, 16));
        if (bytes.every(b => b >= 0x20 && b <= 0x7E)) {
          return bytes.map(b => String.fromCharCode(b)).join('');
        }
      }
      catch {}
      return val;
    }
    default:
      return val;
  }
}

function parseDMS(val: string): number | null {
  const parts = val.split(',').map(s => Number.parseFloat(s.trim()));
  if (parts.length < 3 || parts.some(Number.isNaN)) {
    return null;
  }
  return parts[0] + parts[1] / 60 + parts[2] / 3600;
}

function formatDMS(val: string, ref: string): string {
  const parts = val.split(',').map(s => Number.parseFloat(s.trim()));
  if (parts.length < 3 || parts.some(Number.isNaN)) {
    return val;
  }
  const [d, m, s] = parts;
  return `${Math.floor(d)}° ${Math.floor(m)}' ${s.toFixed(2)}" ${ref}`;
}

const gpsCoordinates = computed(() => {
  if (!exifData.value?.gps) {
    return null;
  }
  const { GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef } = exifData.value.gps;
  if (!GPSLatitude || !GPSLongitude) {
    return null;
  }
  const lat = parseDMS(GPSLatitude);
  const lon = parseDMS(GPSLongitude);
  if (lat === null || lon === null) {
    return null;
  }
  const latSigned = GPSLatitudeRef === 'S' ? -lat : lat;
  const lonSigned = GPSLongitudeRef === 'W' ? -lon : lon;
  return {
    display: `${formatDMS(GPSLatitude, GPSLatitudeRef || 'N')},  ${formatDMS(GPSLongitude, GPSLongitudeRef || 'E')}`,
    mapUrl: `https://www.google.com/maps?q=${latSigned.toFixed(6)},${lonSigned.toFixed(6)}`,
  };
});

interface ExifRow { label: string; value: string }

function buildRows(data: Record<string, string>, labelMap: Record<string, string>, skip: string[] = []): ExifRow[] {
  return Object.entries(data)
    .filter(([k]) => !skip.includes(k))
    .map(([k, v]) => ({ label: labelMap[k] ?? k, value: formatValue(k, v) }));
}

const cameraRows = computed<ExifRow[]>(() =>
  exifData.value ? buildRows(exifData.value.camera, CAMERA_LABELS) : [],
);

const exposureRows = computed<ExifRow[]>(() =>
  exifData.value ? buildRows(exifData.value.exposure, EXPOSURE_LABELS) : [],
);

const gpsRows = computed<ExifRow[]>(() => {
  if (!exifData.value?.gps) {
    return [];
  }
  const coordSkip = ['GPSLatitude', 'GPSLatitudeRef', 'GPSLongitude', 'GPSLongitudeRef'];
  const rows: ExifRow[] = [];
  if (gpsCoordinates.value) {
    rows.push({ label: 'Coordinates', value: gpsCoordinates.value.display });
  }
  rows.push(...buildRows(exifData.value.gps, GPS_LABELS, coordSkip));
  return rows;
});

async function onFileUpload(file: File) {
  if (!file) {
    return;
  }
  loading.value = true;
  error.value = '';
  exifData.value = null;
  generalInfo.value = null;
  exifMissing.value = false;

  try {
    const buffer = await file.arrayBuffer();
    exifData.value = await extractExif(buffer);
  }
  catch (e) {
    const msg = (e as Error).message;
    if (msg.includes('No EXIF') || msg.includes('no readable')) {
      exifMissing.value = true;
      generalInfo.value = {
        name: file.name,
        size: formatBytes(file.size),
        type: file.type || 'image/jpeg',
      };
      // Try to get image dimensions
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        if (generalInfo.value) {
          generalInfo.value.dimensions = `${img.naturalWidth} × ${img.naturalHeight} px`;
        }
        URL.revokeObjectURL(url);
      };
      img.onerror = () => URL.revokeObjectURL(url);
      img.src = url;
    }
    else {
      error.value = msg;
    }
  }
  finally {
    loading.value = false;
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
</script>

<template>
  <div flex flex-col gap-4>
    <c-file-upload accept="image/jpeg,image/jpg" style="padding:10px 20px" @file-upload="onFileUpload">
      Drop JPEG here or <strong>click to browse</strong>
    </c-file-upload>

    <c-alert v-if="error" type="error">
      {{ error }}
    </c-alert>

    <!-- No EXIF: show general info fallback -->
    <template v-if="exifMissing && generalInfo">
      <c-alert type="warning">
        No EXIF metadata found in this image. This file may have had metadata stripped (social media, editors, or privacy tools). Showing general file info instead.
      </c-alert>
      <div class="exif-section">
        <div class="section-header">
          <ImageIcon class="section-icon" />
          <span>General Image Info</span>
        </div>
        <table class="exif-table">
          <tbody>
            <tr>
              <td class="label-cell">
                File Name
              </td>
              <td class="value-cell">
                {{ generalInfo.name }}
              </td>
            </tr>
            <tr>
              <td class="label-cell">
                File Size
              </td>
              <td class="value-cell">
                {{ generalInfo.size }}
              </td>
            </tr>
            <tr>
              <td class="label-cell">
                MIME Type
              </td>
              <td class="value-cell">
                {{ generalInfo.type }}
              </td>
            </tr>
            <tr v-if="generalInfo.dimensions">
              <td class="label-cell">
                Dimensions
              </td>
              <td class="value-cell">
                {{ generalInfo.dimensions }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- EXIF sections -->
    <template v-if="exifData">
      <div v-if="cameraRows.length" class="exif-section">
        <div class="section-header">
          <CameraIcon class="section-icon" />
          <span>Camera &amp; Image</span>
        </div>
        <table class="exif-table">
          <tbody>
            <tr v-for="row in cameraRows" :key="row.label">
              <td class="label-cell">
                {{ row.label }}
              </td>
              <td class="value-cell">
                {{ row.value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="exposureRows.length" class="exif-section">
        <div class="section-header">
          <ApertureIcon class="section-icon" />
          <span>Exposure Settings</span>
        </div>
        <table class="exif-table">
          <tbody>
            <tr v-for="row in exposureRows" :key="row.label">
              <td class="label-cell">
                {{ row.label }}
              </td>
              <td class="value-cell">
                {{ row.value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="gpsRows.length" class="exif-section">
        <div class="section-header">
          <MapMarkerIcon class="section-icon" />
          <span>GPS Location</span>
        </div>
        <table class="exif-table">
          <tbody>
            <tr v-for="row in gpsRows" :key="row.label">
              <td class="label-cell">
                {{ row.label }}
              </td>
              <td class="value-cell">
                {{ row.value }}
                <a
                  v-if="row.label === 'Coordinates' && gpsCoordinates"
                  :href="gpsCoordinates.mapUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="map-link"
                >
                  ↗ Open in Maps
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.exif-section {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(128, 128, 128, 0.2);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-weight: 600;
  font-size: 14px;
  background: rgba(128, 128, 128, 0.08);
  border-bottom: 1px solid rgba(128, 128, 128, 0.15);
}

.section-icon {
  font-size: 18px;
  opacity: 0.7;
}

.exif-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.exif-table tr:not(:last-child) td {
  border-bottom: 1px solid rgba(128, 128, 128, 0.1);
}

.exif-table tr:nth-child(even) td {
  background: rgba(128, 128, 128, 0.03);
}

.label-cell {
  padding: 8px 16px;
  width: 180px;
  min-width: 140px;
  opacity: 0.6;
  vertical-align: top;
  white-space: nowrap;
}

.value-cell {
  padding: 8px 16px;
  font-family: monospace;
  word-break: break-word;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.map-link {
  font-size: 12px;
  opacity: 0.7;
  text-decoration: none;
  border: 1px solid currentColor;
  border-radius: 4px;
  padding: 1px 6px;
  white-space: nowrap;

  &:hover {
    opacity: 1;
  }
}
</style>
