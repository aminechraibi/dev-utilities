import { tool as base64FileConverter } from './base64-file-converter';
import { tool as base64StringConverter } from './base64-string-converter';
import { tool as basicAuthGenerator } from './basic-auth-generator';
import { tool as httpRequestBuilder } from './http-request-builder';
import { tool as markdownHtmlConverter } from './markdown-html-converter';
import { tool as imageResizer } from './image-resizer';
import { tool as curlConverter } from './curl-converter';
import { tool as envVars } from './env-vars';
import { tool as htmlCleaner } from './html-cleaner';
import { tool as licenseGenerator } from './license-generator';
import { tool as barcodeGenerator } from './barcode-generator';
import { tool as exifViewer } from './exif-viewer';
import { tool as imageToAscii } from './image-to-ascii';
import { tool as gradientGenerator } from './gradient-generator';
import { tool as colorContrastChecker } from './color-contrast-checker';
import { tool as businessDaysCalculator } from './business-days-calculator';
import { tool as worldClock } from './world-clock';
import { tool as dateDifferenceCalculator } from './date-difference-calculator';
import { tool as binaryCalculator } from './binary-calculator';
import { tool as statisticsCalculator } from './statistics-calculator';
import { tool as unitConverter } from './unit-converter';
import { tool as fakeDataGenerator } from './fake-data-generator';
import { tool as gitignoreGenerator } from './gitignore-generator';
import { tool as jsonToSql } from './json-to-sql';
import { tool as jsonPathTester } from './json-path-tester';
import { tool as regexVisualizer } from './regex-visualizer';
import { tool as htmlToMarkdown } from './html-to-markdown';
import { tool as yamlToXml } from './yaml-to-xml';
import { tool as csvToJson } from './csv-to-json';
import { tool as faviconGenerator } from './favicon-generator';
import { tool as pdfToText } from './pdf-to-text';
import { tool as numberingBubbles } from './numbering-bubbles';
import { tool as imageColorPicker } from './image-color-picker';
import { tool as imageAnnotator } from './image-annotator';
import { tool as colorPaletteGenerator } from './color-palette-generator';
import { tool as durationCalculator } from './duration-calculator';
import { tool as javascriptFormatter } from './javascript-formatter';
import { tool as cssFormatter } from './css-formatter';
import { tool as htmlMinifier } from './html-minifier';
import { tool as cronExpressionParser } from './cron-expression-parser';
import { tool as dotenvParser } from './dotenv-parser';
import { tool as graphqlFormatter } from './graphql-formatter';
import { tool as csvViewer } from './csv-viewer';
import { tool as jsonSchemaValidator } from './json-schema-validator';
import { tool as base32Encoder } from './base32-encoder';
import { tool as numberToWords } from './number-to-words';
import { tool as byteUnitConverter } from './byte-unit-converter';
import { tool as xmlToYaml } from './xml-to-yaml';
import { tool as morseCodeTranslator } from './morse-code-translator';
import { tool as httpHeaderAnalyzer } from './http-header-analyzer';
import { tool as semverComparator } from './semver-comparator';
import { tool as uuidInspector } from './uuid-inspector';
import { tool as sslCertificateDecoder } from './ssl-certificate-decoder';
import { tool as jwtGenerator } from './jwt-generator';
import { tool as emailNormalizer } from './email-normalizer';

import { tool as asciiTextDrawer } from './ascii-text-drawer';

import { tool as textToUnicode } from './text-to-unicode';
import { tool as safelinkDecoder } from './safelink-decoder';
import { tool as xmlToJson } from './xml-to-json';
import { tool as jsonToXml } from './json-to-xml';
import { tool as regexTester } from './regex-tester';
import { tool as regexMemo } from './regex-memo';
import { tool as markdownToHtml } from './markdown-to-html';
import { tool as pdfSignatureChecker } from './pdf-signature-checker';
import { tool as numeronymGenerator } from './numeronym-generator';
import { tool as macAddressGenerator } from './mac-address-generator';
import { tool as textToBinary } from './text-to-binary';
import { tool as ulidGenerator } from './ulid-generator';
import { tool as ibanValidatorAndParser } from './iban-validator-and-parser';
import { tool as stringObfuscator } from './string-obfuscator';
import { tool as textDiff } from './text-diff';
import { tool as emojiPicker } from './emoji-picker';
import { tool as passwordStrengthAnalyser } from './password-strength-analyser';
import { tool as yamlToToml } from './yaml-to-toml';
import { tool as jsonToToml } from './json-to-toml';
import { tool as tomlToYaml } from './toml-to-yaml';
import { tool as tomlToJson } from './toml-to-json';
import { tool as jsonToCsv } from './json-to-csv';
import { tool as cameraRecorder } from './camera-recorder';
import { tool as listConverter } from './list-converter';
import { tool as phoneParserAndFormatter } from './phone-parser-and-formatter';
import { tool as jsonDiff } from './json-diff';
import { tool as ipv4RangeExpander } from './ipv4-range-expander';
import { tool as httpStatusCodes } from './http-status-codes';
import { tool as yamlToJson } from './yaml-to-json-converter';
import { tool as jsonToYaml } from './json-to-yaml-converter';
import { tool as ipv6UlaGenerator } from './ipv6-ula-generator';
import { tool as ipv4AddressConverter } from './ipv4-address-converter';
import { tool as benchmarkBuilder } from './benchmark-builder';
import { tool as userAgentParser } from './user-agent-parser';
import { tool as ipv4SubnetCalculator } from './ipv4-subnet-calculator';
import { tool as dockerRunToDockerComposeConverter } from './docker-run-to-docker-compose-converter';
import { tool as htmlWysiwygEditor } from './html-wysiwyg-editor';
import { tool as rsaKeyPairGenerator } from './rsa-key-pair-generator';
import { tool as textToNatoAlphabet } from './text-to-nato-alphabet';
import { tool as slugifyString } from './slugify-string';
import { tool as keycodeInfo } from './keycode-info';
import { tool as jsonMinify } from './json-minify';
import { tool as bcrypt } from './bcrypt';
import { tool as bip39 } from './bip39-generator';
import { tool as caseConverter } from './case-converter';
import { tool as chmodCalculator } from './chmod-calculator';
import { tool as chronometer } from './chronometer';
import { tool as colorConverter } from './color-converter';
import { tool as crontabGenerator } from './crontab-generator';
import { tool as dateTimeConverter } from './date-time-converter';
import { tool as deviceInformation } from './device-information';
import { tool as cypher } from './encryption';
import { tool as etaCalculator } from './eta-calculator';
import { tool as percentageCalculator } from './percentage-calculator';
import { tool as gitMemo } from './git-memo';
import { tool as hashText } from './hash-text';
import { tool as hmacGenerator } from './hmac-generator';
import { tool as htmlEntities } from './html-entities';
import { tool as baseConverter } from './integer-base-converter';
import { tool as jsonViewer } from './json-viewer';
import { tool as jwtParser } from './jwt-parser';
import { tool as loremIpsumGenerator } from './lorem-ipsum-generator';
import { tool as mathEvaluator } from './math-evaluator';
import { tool as metaTagGenerator } from './meta-tag-generator';
import { tool as mimeTypes } from './mime-types';
import { tool as otpCodeGeneratorAndValidator } from './otp-code-generator-and-validator';
import { tool as qrCodeGenerator } from './qr-code-generator';
import { tool as wifiQrCodeGenerator } from './wifi-qr-code-generator';
import { tool as randomPortGenerator } from './random-port-generator';
import { tool as romanNumeralConverter } from './roman-numeral-converter';
import { tool as sqlPrettify } from './sql-prettify';
import { tool as svgPlaceholderGenerator } from './svg-placeholder-generator';
import { tool as temperatureConverter } from './temperature-converter';
import { tool as textStatistics } from './text-statistics';
import { tool as tokenGenerator } from './token-generator';
import type { ToolCategory } from './tools.types';
import { tool as urlEncoder } from './url-encoder';
import { tool as urlParser } from './url-parser';
import { tool as uuidGenerator } from './uuid-generator';
import { tool as macAddressLookup } from './mac-address-lookup';
import { tool as xmlFormatter } from './xml-formatter';
import { tool as yamlViewer } from './yaml-viewer';

export const toolsByCategory: ToolCategory[] = [
  {
    name: 'Crypto',
    components: [tokenGenerator, hashText, bcrypt, uuidGenerator, ulidGenerator, cypher, bip39, hmacGenerator, rsaKeyPairGenerator, passwordStrengthAnalyser, pdfSignatureChecker, jwtGenerator, sslCertificateDecoder, uuidInspector],
  },
  {
    name: 'Converter',
    components: [
      dateTimeConverter,
      baseConverter,
      romanNumeralConverter,
      base64StringConverter,
      base64FileConverter,
      colorConverter,
      caseConverter,
      textToNatoAlphabet,
      textToBinary,
      textToUnicode,
      yamlToJson,
      yamlToToml,
      jsonToYaml,
      jsonToToml,
      listConverter,
      tomlToJson,
      tomlToYaml,
      xmlToJson,
      jsonToXml,
      xmlToYaml,
      yamlToXml,
      markdownToHtml,
      htmlToMarkdown,
      markdownHtmlConverter,
      morseCodeTranslator,
      byteUnitConverter,
      numberToWords,
      base32Encoder,
      unitConverter,
    ],
  },
  {
    name: 'Web',
    components: [
      urlEncoder,
      htmlEntities,
      urlParser,
      deviceInformation,
      basicAuthGenerator,
      metaTagGenerator,
      otpCodeGeneratorAndValidator,
      mimeTypes,
      jwtParser,
      keycodeInfo,
      slugifyString,
      htmlWysiwygEditor,
      userAgentParser,
      httpStatusCodes,
      jsonDiff,
      safelinkDecoder,
      httpHeaderAnalyzer,
      semverComparator,
      faviconGenerator,
      licenseGenerator,
      htmlCleaner,
    ],
  },
  {
    name: 'Images and videos',
    components: [qrCodeGenerator, wifiQrCodeGenerator, svgPlaceholderGenerator, cameraRecorder, imageAnnotator, imageColorPicker, colorPaletteGenerator, numberingBubbles, gradientGenerator, imageToAscii, exifViewer, barcodeGenerator, colorContrastChecker, imageResizer],
  },
  {
    name: 'Development',
    components: [
      gitMemo,
      randomPortGenerator,
      crontabGenerator,
      jsonViewer,
      jsonMinify,
      jsonToCsv,
      sqlPrettify,
      chmodCalculator,
      curlConverter,
      httpRequestBuilder,
      dockerRunToDockerComposeConverter,
      xmlFormatter,
      yamlViewer,
      emailNormalizer,
      regexTester,
      regexMemo,
      jsonSchemaValidator,
      csvViewer,
      csvToJson,
      jsonToSql,
      graphqlFormatter,
      dotenvParser,
      cronExpressionParser,
      htmlMinifier,
      cssFormatter,
      javascriptFormatter,
      pdfToText,
      regexVisualizer,
      jsonPathTester,
      gitignoreGenerator,
      envVars,
    ],
  },
  {
    name: 'Network',
    components: [ipv4SubnetCalculator, ipv4AddressConverter, ipv4RangeExpander, macAddressLookup, macAddressGenerator, ipv6UlaGenerator],
  },
  {
    name: 'Math',
    components: [mathEvaluator, etaCalculator, percentageCalculator, durationCalculator, statisticsCalculator, binaryCalculator],
  },
  {
    name: 'Measurement',
    components: [chronometer, temperatureConverter, benchmarkBuilder, dateDifferenceCalculator, businessDaysCalculator, worldClock],
  },
  {
    name: 'Text',
    components: [
      loremIpsumGenerator,
      textStatistics,
      emojiPicker,
      stringObfuscator,
      textDiff,
      numeronymGenerator,
      asciiTextDrawer,
    ],
  },
  {
    name: 'Data',
    components: [phoneParserAndFormatter, ibanValidatorAndParser, fakeDataGenerator],
  },
];

export const tools = toolsByCategory.flatMap(({ components }) => components);
export const toolsWithCategory = toolsByCategory.flatMap(({ components, name }) =>
  components.map(tool => ({ category: name, ...tool })),
);
