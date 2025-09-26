import { test, expect } from '@playwright/test';
import path from 'path';
import baseConfig from '../config.js';
import crypto from 'node:crypto';
import { faker } from '@faker-js/faker/locale/id_ID';

function escapeCssId(id) {
  return id.replace(/\$/g, '\\$').replace(/\./g, '\\.');
}

function StartApplication() {
  const workflowId = crypto.randomUUID();

  const payload = {
    id: workflowId,
    name: 'dp-ndf-v0_1_0',
  };
  const start = fetch(`${baseConfig.lgs_base_url}/application/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return { start, workflowId };
}

const sendMq = async (workflowId, videoUrl) => {
  const url = baseConfig.mq_publish_url;
  const username = baseConfig.mq_user;
  const password = baseConfig.mq_password;

  const routing_key = 'rk.lora-gateway-service.scheduling.appointments';
  const start = new Date();
  start.setHours(18, 25, 0, 0);

  const end = new Date(start.getTime() + 30 * 60 * 1000);
  // const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  const appointment_time_target_start = start.toISOString();
  const appointment_time_target_end = end.toISOString();

  const payload = {
    appointment_full_detail: {
      appointment_uuid: crypto.randomUUID(),
      appointment_number: `2025${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      activity_type_code: '4W_VIRTUAL_SURVEY',
      appointment_reference: workflowId,
      location_type_code: 'VIRTUAL',
      location_descriptor: '999',
      description: '',
      appointment_date_target: '2025-12-31',
      appointment_time_target_start,
      appointment_time_target_end,
      target_duration_minutes: 30,
      timezone_identifier: 'Asia/Jakarta',
      priority_level: 0,
      system_owner_lookup_code: 'SYSTEM_OWNER_LOS',
      process_identifier_lookup_code: 'PROCESS_IDENTIFIER_SURVEY_SCHEDULE',
      canceled: false,
      cancel_reason:
        'Rescheduled to appointment 908275be-048a-4872-84e7-f7590b60e85a',
      canceled_at: '2025-09-04T06:26:19.923628Z',
      rescheduled: false,
      reschedule_reason:
        'Digital Partnership res-cheduling for partner bfi-qa-partner-goto on loan_submission_id f792d5b7-3461-4b6b-aa3f-07c11320ea32',
      rescheduled_at: '2025-09-04T06:26:19.921894Z',
      rescheduled_to_appointment_uuid: '908275be-048a-4872-84e7-f7590b60e85a',
      resources: [
        {
          resource_uuid: '3a794b35-6d6a-459b-89fa-b96fa589fd1a',
          resource_identifiers: '000000',
          pre_travel_duration_minutes: 30,
          post_travel_duration_minutes: 30,
          resource_type_code: 'ADMIN_SURVEY',
          attribute_1: 'Arrifqi',
          attribute_2: 'lipsum',
          attribute_3: 'lipsum',
        },
        {
          resource_uuid: '3a794b35-6d6a-459b-89fa-b96fa589fd1a',
          resource_identifiers: '000001',
          pre_travel_duration_minutes: 30,
          post_travel_duration_minutes: 30,
          resource_type_code: 'PROSPECT',
          attribute_1: 'lipsum',
          attribute_2: 'lipsum',
          attribute_3: 'lipsum',
        },
      ],
      process_fields: [
        {
          process_field_key: 'survey_pin',
          process_field_value: '123456',
          description: 'Survey PIN',
        },
        {
          process_field_key: 'survey_video_url',
          process_field_value: videoUrl,
          description: 'Survey Video URL',
        },
      ],
    },
  };

  console.log(JSON.stringify(payload));

  const body = {
    properties: {
      content_type: 'application/json',
      delivery_mode: 2,
    },
    routing_key: routing_key,
    payload: JSON.stringify(payload),
    payload_encoding: 'string',
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    if (result.routed) {
      console.log(`✔ Message sent to queue ${routing_key}`);
    } else {
      console.error('✘ Failed to route message:', result);
    }
  } catch (error) {
    console.log(error);
  }
};

const generateLicensePlate = () => {
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomLetters(min, max) {
    const length = randomInt(min, max);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array.from({ length }, () => chars[randomInt(0, 25)]).join('');
  }

  const part1 = randomLetters(1, 2);
  const part2 = randomInt(1, 9999).toString();
  const part3 = randomLetters(1, 3);

  return `${part1}${part2}${part3}`;
};

test('Create a new survey 4w task', async ({ page }) => {
  const licensePlate = generateLicensePlate();
  const payload = {
    '$.asset.stnk_status': 'ACTIVE',
    '$.asset.asset_code': 'DAIHATSU.AYLA.D10AT',
    '$.asset.bpkb_ownership': '1',
    '$.asset.bpkb_status': 'on_hand',
    '$.asset.license_plate': licensePlate,
    '$.asset.manufacturing_year': 2021,
    '$.asset.tax_status': 'tax_paid_off',
    '$.channel.ekyc_authority': 'partner',
    '$.channel.partner_id': '907d075e-5cef-4179-940e-794946b6eb33',
    '$.channel.ktp_ocr_required': false,
    '$.channel.marketing_id': '2311NC0006',
    '$.channel.partner_internal_name': 'partner-goto',
    '$.channel.soa_id': '28',
    '$.customer.bank_information.account_name': 'MULTIFINANCE ANAK BANGSA GOTO',
    '$.customer.bank_information.account_number': '0010988888',
    '$.customer.bank_information.bank_id': 47,
    '$.customer.contact.mobile_number': '+6282178593737',
    '$.customer.domicile.address.street_address': 'JL. JAKARTA RAYA',
    '$.customer.domicile.address.sub_district_code': '12.71.05.1002',
    '$.customer.domicile.ownership_code': 'SD',
    '$.customer.ktp.birth_date': '1997-04-24',
    '$.customer.ktp.birth_place': 'MANOKWARI',
    '$.customer.ktp.gender': 'M',
    '$.customer.ktp.name': `${faker.person.firstName()} ${faker.person.lastName()}`,
    '$.customer.ktp.nik': '3674066302020005',
    '$.customer.ktp.street_address': 'JALAN JALAN',
    '$.customer.ktp.sub_district_code': '32.01.36.2004',
    '$.customer.ktp.zip_code': '16841',
    '$.customer.personal.marital_status_code': 'S',
    '$.customer.professional.education_code': 'S1',
    '$.customer.professional.monthly_income': '10000000',
    '$.customer.professional.occupation_type_code': 'M',
    '$.documents.ktp.document_id': 'a114ae6f-09f2-4b5b-b782-bac9dae86d44',
    '$.documents.selfie.document_id': '9d40dacc-eef0-4c48-95c6-5a8ca9f3bc2f',
    '$.loan_structure.original_amount': 12690000,
    '$.loan_structure.product_id': 1,
    '$.loan_structure.product_offering': 37,
    '$.loan_structure.tenure': 12,
    '$.process.survey_task.surveyor_employee_name': 'Joko Anwar',
    '$.customer.personal.number_dependents': 5,
  };

  const { workflowId, start } = await StartApplication();
  try {
    await start;
    await fetch(`${baseConfig.lgs_base_url}/application/${workflowId}/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(
      `✔ Video URL: "http://127.0.0.1:8082/rtc/web/start/iAkdFvgWH6",`
    );
    console.log(`✔ Task generated with workflowId: ${workflowId}`);
    console.log(`✔ License plate: ${payload['$.asset.license_plate']}`);
    console.log(`✔ Customer name: ${payload['$.customer.ktp.name']}`);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await sendMq(workflowId, 'http://127.0.0.1:8082/rtc/web/start/iAkdFvgWH6');
    await page.waitForTimeout(5000);
    await page.goto('http://localhost:3000/admin');
  } catch (error) {
    console.error(error);
  }
});

async function navigateToAdmin(page) {
  await page.goto('http://localhost:3000/admin');
}

async function selectLastProcessingTask(page) {
  const berjalanTab = page.getByRole('tab', { name: /Berjalan/i });
  await berjalanTab.click();
  const lastTaskRow = page.locator('#process-tasks tr[id]').last();
  await lastTaskRow.click();
}

async function selectLastScheduledTask(page) {
  const task = await page.locator('#scheduled-tasks tr[id]').last();
  await task.click();
}

async function submitForm(page, timeout = 5000) {
  const submitButton = page.locator(
    'button[name="action"][type="submit"][value="submit"]'
  );
  await submitButton.waitFor({ state: 'visible' });

  let isLoading = (await submitButton.getAttribute('data-loading')) === 'true';
  if (isLoading) {
    await page.waitForTimeout(timeout);
  }
  await submitButton.click();
  await page.waitForTimeout(timeout);
}

async function fillFormFields(page, formData) {
  for (const field of formData) {
    try {
      if (field.type === 'input') {
        const locator = field.selector
          ? page.locator(field.selector)
          : page.locator(`#${escapeCssId(field.id)}`);
        await locator.fill(field.value);
        console.log(
          `Filled input: ${field.id || field.selector} with ${field.value}`
        );
      } else if (field.type === 'select') {
        const locator = field.selector
          ? page.locator(field.selector)
          : page.locator(`#${escapeCssId(field.id)}`);
        await locator.selectOption(field.value);
        console.log(
          `Selected option: ${field.id || field.selector} = ${field.value}`
        );
      } else if (field.type === 'radio') {
        const radioLocator = field.selector
          ? page.locator(field.selector)
          : page.locator(
              `input[name="${escapeCssId(field.name)}"][value="${field.value}"]`
            );
        await radioLocator.check();
        console.log(`Checked radio: ${field.name} = ${field.value}`);
      } else if (field.type === 'file') {
        const fileInput = field.selector
          ? page.locator(field.selector)
          : page.locator(`#${escapeCssId(field.id)} input[type="file"]`);
        await fileInput.setInputFiles(field.filePath);
        console.log(`Uploaded file: ${field.id || field.selector}`);
        if (field.delay) await page.waitForTimeout(field.delay);
      } else if (field.type === 'button') {
        const button = page.locator(field.selector);
        await button.click();
        console.log(`Clicked button: ${field.selector}`);
      } else if (field.type === 'custom' && field.callback) {
        await field.callback(page);
      }

      if (field.waitTimeout) {
        await page.waitForTimeout(field.waitTimeout);
      }
    } catch (error) {
      console.error(
        `Error processing field ${field.id || field.selector}:`,
        error
      );
    }
  }
}

const PIN_TEST_DATA = [
  {
    type: 'custom',
    callback: async (page) => {
      const startSurveyBtn = page.locator('#startSurvey');
      await startSurveyBtn.waitFor({ state: 'visible' });
      await startSurveyBtn.click();

      const pinInputs = page.locator('input[type="tel"]');
      await expect(pinInputs).toHaveCount(6);

      const pin = '123456';
      for (let i = 0; i < pin.length; i++) {
        await pinInputs.nth(i).fill(pin[i]);
      }
    },
  },
];

const VERIFICATION_PAGE_DATA = [
  {
    type: 'file',
    id: '$.documents.ktp.document_id',
    filePath: path.resolve(process.cwd(), 'assets/gas.png'),
  },
  {
    type: 'file',
    id: '$.documents.selfie.document_id',
    filePath: path.resolve(process.cwd(), 'assets/gas.png'),
  },
  {
    type: 'input',
    id: '$.customer.domicile.address.rt',
    value: '000',
  },
  {
    type: 'input',
    id: '$.customer.domicile.address.rw',
    value: '000',
  },
  {
    type: 'custom',
    callback: async (page) => {
      const locationButton = page.locator('#address-location-button_null');
      await locationButton.click();
      const dialog = page.getByRole('dialog');
      await dialog.waitFor({ state: 'visible' });
      const confirmButton = dialog.locator('.uk-button.uk-button-primary');
      await confirmButton.waitFor({ state: 'visible' });
      await confirmButton.click();
    },
  },
  {
    type: 'select',
    id: 'ltw.custom_domicile_ownership_code',
    value: 'Keluarga',
  },
  {
    type: 'file',
    id: '$.documents.stnk.document_id',
    filePath: path.resolve(process.cwd(), 'assets/stnk.jpeg'),
  },
  {
    type: 'file',
    id: '$.documents.tax_notice.document_id',
    filePath: path.resolve(process.cwd(), 'assets/stnk.jpeg'),
  },
  {
    type: 'custom',
    callback: async (page) => {
      await page.waitForTimeout(5000);
      const ocrLoading = page.locator('#asset-survey-section__loading');
      if (await ocrLoading.isVisible()) {
        await page.waitForTimeout(5000);
        const failedModal = page.locator(
          '#asset-survey-section__failed-upload-modal'
        );
        if (await failedModal.isVisible()) {
          const button = failedModal.locator('button');
          await button.click();
        }
      }
      const failedModal = page.locator(
        '#asset-survey-section__failed-upload-modal'
      );
      if (await failedModal.isVisible()) {
        const button = failedModal.locator('button');
        await button.click();
        await page
          .locator('#\\$\\.asset\\.tax_expiration_date')
          .fill('2029-06-24');
        await page
          .locator('#\\$\\.asset\\.stnk_expiration_date')
          .fill('2029-06-24');
        await page
          .locator('#\\$\\.process\\.stnk_ocr_result\\.unit_color')
          .fill('ABU ABU');
        await page
          .locator('#\\$\\.process\\.stnk_ocr_result\\.chassis_number')
          .fill('P1234567890129831');
        await page
          .locator('#\\$\\.process\\.stnk_ocr_result\\.engine_number')
          .fill('L15Z15605255');
        await page.locator('#\\$\\.asset\\.stnk_number').fill('53358771');
      }
    },
  },
  {
    type: 'radio',
    name: '$.asset.bpkb_ownership',
    value: '1',
  },
  {
    type: 'radio',
    name: 'ltw.custom_vehicle_guaranteed',
    value: 'OWNED_BY_DEBTOR',
  },
  {
    type: 'radio',
    name: 'ltw.custom_bpkb_ownership_period',
    value: 'MORE_THAN_24_MONTH',
  },
];

const FOTO_DOKUMEN_DATA = [
  // Foto Aset files
  ...[
    '$.documents.asset.asset_front.document_id',
    '$.documents.asset.asset_rear.document_id',
    '$.documents.asset.asset_front_left_side.document_id',
    '$.documents.asset.asset_front_right_side.document_id',
    '$.documents.asset.asset_rear_left_side.document_id',
    '$.documents.asset.asset_rear_right_side.document_id',
    '$.documents.asset.asset_interior_front_side.document_id',
    '$.documents.asset.asset_interior_rear_side.document_id',
    '$.documents.asset.asset_interior_center_sid.document_id',
    '$.documents.asset.speedometer.document_id',
    '$.documents.asset.engine_number.document_id',
    '$.documents.asset.selfie_with_vehicle.document_id',
  ].map((id) => ({
    type: 'custom',
    callback: async (page) => {
      const fotoAsetLink = page.locator('li[role="presentation"] a', {
        hasText: 'Foto Aset',
      });
      await fotoAsetLink.click();
      const escapedId = escapeCssId(id);
      const fileInput = page.locator(`#${escapedId} input[type="file"]`);
      await fileInput.setInputFiles(
        path.resolve(process.cwd(), 'assets/gas.png')
      );
      console.log(`Uploaded file to input: ${id}`);
      await page.waitForTimeout(200);
    },
  })),

  // Dokumen Aset files
  {
    type: 'custom',
    callback: async (page) => {
      const dokumenAsetLink = page.locator('li[role="presentation"] a', {
        hasText: 'Dokumen Aset',
      });
      await dokumenAsetLink.click();

      const documentConfigs = [
        { id: '$.documents.bpkb_page_1.document_id', file: 'assets/bpkb1.jpg' },
        { id: '$.documents.bpkb_page_2.document_id', file: 'assets/bpkb2.jpg' },
        { id: '$.documents.bpkb_page_3.document_id', file: 'assets/bpkb3.jpg' },
        { id: '$.documents.bpkb_page_4.document_id', file: 'assets/bpkb4.jpg' },
        {
          id: '$.documents.chassis_number.document_id',
          file: 'assets/gas.png',
        },
        { id: '$.documents.bpkb_invoice.document_id', file: 'assets/gas.png' },
      ];

      for (const doc of documentConfigs) {
        const escapedId = escapeCssId(doc.id);
        const fileInput = page.locator(`#${escapedId} input[type="file"]`);
        await fileInput.setInputFiles(path.resolve(process.cwd(), doc.file));
        console.log(`Uploaded file to input: ${doc.id}`);
        await page.waitForTimeout(200);
      }
    },
  },

  // Pribadi files
  {
    type: 'custom',
    callback: async (page) => {
      await page.waitForTimeout(10000);
      const pribadiLink = page.locator('li[role="presentation"] a', {
        hasText: 'Pribadi',
      });
      await pribadiLink.click();

      const documentIds = [
        '$.documents.employment_evidence.document_id',
        '$.documents.npwp.document_id',
        '$.documents.alternate_identity_document.document_id',
        '$.documents.marriage_certificate.document_id',
        '$.documents.divorce_certificate.document_id',
        '$.documents.death_certificate.document_id',
        '$.documents.house_ownership.document_id',
      ];

      for (const docId of documentIds) {
        const escapedId = escapeCssId(docId);
        const fileInput = page.locator(`#${escapedId} input[type="file"]`);
        await fileInput.setInputFiles(
          path.resolve(process.cwd(), 'assets/gas.png')
        );
        console.log(`Uploaded file to input: ${docId}`);
        await page.waitForTimeout(200);
      }
    },
  },

  // Perjanjian files
  {
    type: 'custom',
    callback: async (page) => {
      const perjanjianLink = page.locator('li[role="presentation"] a', {
        hasText: 'Perjanjian',
      });
      await perjanjianLink.click();

      const documentIds = [
        '$.documents.debtor_signature.document_id',
        '$.documents.bpkb_receipt_2.document_id',
        '$.documents.customer_receipt_2.document_id',
        '$.documents.payment_receipt.document_id',
      ];

      for (const docId of documentIds) {
        const escapedId = escapeCssId(docId);
        const fileInput = page.locator(`#${escapedId} input[type="file"]`);
        await fileInput.setInputFiles(
          path.resolve(process.cwd(), 'assets/gas.png')
        );
        console.log(`Uploaded file to input: ${docId}`);
        await page.waitForTimeout(200);
      }
    },
  },
];

const ASET_KAPASITAS_DATA = [
  {
    type: 'radio',
    name: '$.asset.debtor_spouse_can_identify_collateral',
    value: 'true',
  },
  { type: 'radio', name: '$.asset.unit_under_consumer_control', value: 'true' },
  {
    type: 'radio',
    name: '$.asset.unit_physical_condition_normal',
    value: 'true',
  },
  {
    type: 'radio',
    name: '$.asset.unit_no_clear_mark_of_accident',
    value: 'NO',
  },
  { type: 'radio', name: '$.asset.unit_able_to_turn_on', value: 'true' },
  { type: 'radio', name: '$.asset.unit_able_to_move_normally', value: 'true' },
  {
    type: 'radio',
    name: '$.asset.unit_type_and_physical_condition_appropriate',
    value: 'true',
  },
  {
    type: 'radio',
    name: '$.asset.engine_and_chassis_number_with_document_appropriate',
    value: 'true',
  },
  { type: 'radio', name: '$.asset.whole_interior_condition', value: 'GOOD' },
  {
    type: 'radio',
    name: '$.customer.personal.funds_other_than_purchase',
    value: 'false',
  },
  {
    type: 'radio',
    name: '$.customer.personal.installment_helper_than_spouse',
    value: 'false',
  },
  { type: 'select', id: '$.asset.asset_usage', value: 'NON_COMMERCIAL' },
  {
    type: 'custom',
    callback: async (page) => {
      await page.locator(`.rupiah-text-input`).nth(1).fill('10000000');
      await page.locator(`.rupiah-text-input`).nth(2).fill('1000000');
    },
  },
];

const INFO_LAINNYA_DATA = [
  {
    type: 'input',
    id: '$.customer.personal.mother_maiden_name',
    value: 'Irene Adler',
  },
  { type: 'input', id: '$.customer.contact.email', value: 'test@gmail.com' },
  {
    type: 'input',
    id: '$.customer.personal.number_dependents_children',
    value: '5',
  },
  {
    type: 'input',
    id: '$.customer.personal.number_dependents_other',
    value: '0',
  },
  { type: 'radio', name: '$.customer.professional.npwp_type', value: 'NPWP' },
  {
    type: 'select',
    id: 'ltw.custom_customer_professional_economic_sector',
    value: 'JASA',
  },
  {
    type: 'select',
    id: 'ltw.custom_customer_professional_industry',
    value: 'KOPI',
  },
  {
    type: 'input',
    id: '$.customer.emergency_contact.name',
    value: 'kontak darurat name',
  },
  {
    type: 'select',
    id: '$.customer.emergency_contact.relation_with_customer',
    value: 'FAMILY',
  },
  {
    type: 'input',
    selector: 'input[name="\\$.customer.emergency_contact.mobile_number"]',
    value: '81234567890',
  },
  {
    type: 'input',
    id: '$.customer.emergency_contact.street_address',
    value: 'sample alamat rumah',
  },
  { type: 'input', id: '$.customer.emergency_contact.rt', value: '000' },
  { type: 'input', id: '$.customer.emergency_contact.rw', value: '000' },
  {
    type: 'file',
    selector: '#\\$\\.documents\\.ktp\\.document_id input[type="file"]',
    filePath: path.resolve(process.cwd(), 'assets/gas.png'),
  },
  {
    type: 'custom',
    callback: async (page) => {
      const dropdownInput = page
        .locator('.searchable-dropdown__input-wrapper input')
        .nth(1);
      await dropdownInput.click();
      await dropdownInput.fill('silalas');

      const option = page.locator('.searchable-dropdown__option button', {
        hasText: 'Kelurahan Silalas, Kecamatan Medan Barat',
      });
      await option.waitFor({ state: 'visible', timeout: 10000 });
      await option.click();
    },
  },
];

const DATA_TAMBAHAN_DATA = [
  {
    type: 'radio',
    name: '$.customer.professional.business_suitability',
    value: 'true',
  },
  {
    type: 'radio',
    name: 'ltw.custom_customer_personal_character_4w',
    value: 'NO_NEGATIVE_INFO',
  },
  {
    type: 'input',
    id: '$.customer.professional.other_business',
    value: 'Tidak Ada',
  },
  {
    type: 'input',
    id: '$.customer.professional.business_since_year',
    value: '2000',
  },
  { type: 'input', id: '$.customer.domicile.stay_since', value: '2000' },
  {
    type: 'select',
    id: 'ltw.custom_customer_employment_status',
    value: 'PERMANENT_EMPLOYEE',
  },
  {
    type: 'custom',
    callback: async (page) => {
      const gasFilePath = path.resolve(process.cwd(), 'assets/gas.png');
      const locationInput = page
        .locator(`.carousel-thumbnail__actions input[type="file"]`)
        .nth(0);
      await locationInput.setInputFiles(gasFilePath);
      const houseInput = page
        .locator(`.carousel-thumbnail__actions input[type="file"]`)
        .nth(1);
      await houseInput.setInputFiles(gasFilePath);
    },
  },
];

const PENJAMIN_DATA = [
  {
    type: 'input',
    selector: 'input[name="\\$.guarantor.mobile_number"]',
    value: '81234567891',
  },
  {
    type: 'select',
    id: 'ltw.custom_guarantor_marital_status_code',
    value: 'Single',
  },
  {
    type: 'custom',
    callback: async (page) => {
      await page.locator(`.rupiah-text-input`).nth(0).fill('10000000');
    },
  },
  {
    type: 'select',
    id: 'ltw.custom_guarantor_relation_with_customer_code',
    value: 'Child',
  },
  {
    type: 'select',
    id: 'ltw.custom_guarantor_occupation_type_code',
    value: 'Employee',
  },
  {
    type: 'select',
    id: 'ltw.custom_guarantor_occupation_code',
    value: 'Marketing',
  },
  { type: 'select', id: 'ltw.custom_guarantor_industry_code', value: 'KOPI' },
  {
    type: 'input',
    id: '$.guarantor.domicile.street_address',
    value: 'jalan jalan guarantor',
  },
  {
    type: 'select',
    id: 'address-province--guarantor-domicile-sub_district_code',
    value: '51',
    waitTimeout: 500,
  },
  {
    type: 'select',
    id: 'address-city--guarantor-domicile-sub_district_code',
    value: '51.71',
    waitTimeout: 500,
  },
  {
    type: 'select',
    id: 'address-district--guarantor-domicile-sub_district_code',
    value: '51.71.01',
    waitTimeout: 500,
  },
  {
    type: 'select',
    id: 'address-subdistrict--guarantor-domicile-sub_district_code',
    value: '51.71.01.1004',
  },
  { type: 'input', id: '$.guarantor.domicile.rt', value: '000' },
  { type: 'input', id: '$.guarantor.domicile.rw', value: '000' },
];

const PEMBIAYAAN_DATA = [
  {
    type: 'custom',
    callback: async (page) => {
      const modal = page.locator('.rescoring-result-modal');
      if (await modal.isVisible()) {
        const button = modal.locator('button[type="button"]');
        await button.click();
        console.log('Rescoring modal button clicked.');
      } else {
        console.log('Rescoring modal not visible.');
      }
    },
  },
];

const PENERIMAAN_BPKB_DATA = [
  {
    type: 'radio',
    name: '$.process.survey_task.bpkb_submission.submission_method',
    value: 'BRANCH_DROPOFF',
    waitTimeout: 500,
  },
  {
    type: 'custom',
    callback: async (page) => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const day = String(tomorrow.getDate()).padStart(2, '0');
      const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const year = tomorrow.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      await page
        .locator(
          '#appointment-date-time__date__ltw_survey_task_bpkb_submission_submission_appointment_with_default_time'
        )
        .evaluate((el, date) => {
          el.setAttribute('data-date', date);
        }, formattedDate);
    },
  },
];

async function setupStnkOcrMock(page) {
  await page.route(
    'http://127.0.0.1:8082/proxy/invoke/stnk-ocr-v1?in=struct&out=struct',
    (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          api_response: {
            ocr_details: {
              address:
                'JL ... MELATI NO . 45 , RT.003 / RW 007 , LABU , KEC . CILANDAK KEL . PONDOK JAKSEL',
              bpkb_number: '02',
              brand: 'HONDA',
              color: 'HITAM METALIK',
              cylinder_capacity: '125 cc',
              fuel: 'BENSIN',
              machine_number: '2NDS903234',
              manufacture_year: '2023',
              model: 'SCOOTER',
              name: 'MULYONO SUPRAPTO',
              nik: null,
              registration_number: 'B 1234 BTC',
              registration_year: '2023',
              stnk_expiry_date: '13-06-2029',
              stnk_number: '05303210.H',
              tax_expiry_date: '13-06-2025',
              type: 'SEPEDA MOTOR',
              vin: 'MJLV8DA2H7K001231',
            },
            ocr_result: { status: 'success' },
          },
        }),
      });
    }
  );
}

async function setupBpkbOcrMock(page) {
  await page.route(
    'http://127.0.0.1:8082/proxy/invoke/bpkb-ocr-v1?in=struct&out=struct',
    (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          api_response: {
            ocr_details: {
              apm_name: 'PT . SUZUKI INDOMOBIL MOTOR',
              bpkb_number: 'P06637346',
              color: 'HITAM',
              cylinder_capacity: '1462 CC',
              form_number: '',
              fuel: 'BENSIN',
              invoice_date: '19-11-2019',
              invoice_number: 'W4102663',
              is_duplicate: false,
              machine_number: 'K15871110940',
              manufacture_year: '2019',
              other_document_number: 'BPKB D 181',
              owner_address:
                'KP . GEBANG RT 003 RW 003 KEL . SATRIA JAJA KEC . TAMBUN UTARA KABUPATEN BEKASI',
              owner_issued_date: '27-11-2019',
              owner_issued_in: 'JAKARTA',
              owner_name: 'ADE KARNI SADELI',
              owner_nik: '3209310510810011',
              owner_occupation: 'PEDAGANG',
              pib_number: 'OEWIP / EARN1 / 22879906 / 2118',
              registration_number: 'B 9964 FAU',
              registration_year: null,
              sut_number: 'Sk.45211A3.402 / OR70 / 2018',
              tpt_number: '1295 / 1LMATE / TPT / 12 / 2018',
              vehicle_brand: 'SUZUKI',
              vehicle_model: 'PICK UP',
              vehicle_type: 'AEV415P',
              vin: 'MHYHOCGTR7132046',
            },
            ocr_result: { status: 'success' },
          },
        }),
      });
    }
  );
}

// Refactored Tests
test('Task: input 6-digit PIN', async ({ page }) => {
  await navigateToAdmin(page);
  await selectLastScheduledTask(page);
  await fillFormFields(page, PIN_TEST_DATA);
});

test(
  'Task: Fill Page Verifikasi',
  async ({ page }) => {
    await navigateToAdmin(page);
    await setupStnkOcrMock(page);
    await selectLastProcessingTask(page);
    await page.waitForSelector('#form-document-overlay', { state: 'detached' });
    await fillFormFields(page, VERIFICATION_PAGE_DATA);
    await submitForm(page);
  },
  { timeout: 300000 }
);

test(
  'Task: Fill Page Foto Aset & Dokumen',
  async ({ page }) => {
    await navigateToAdmin(page);
    await setupStnkOcrMock(page);
    await setupBpkbOcrMock(page);
    await selectLastProcessingTask(page);
    await fillFormFields(page, FOTO_DOKUMEN_DATA);
    await submitForm(page);
  },
  { timeout: 300000 }
);

test(
  'Task: Fill Page Aset & Kapasitas',
  async ({ page }) => {
    await navigateToAdmin(page);
    await selectLastProcessingTask(page);
    await fillFormFields(page, ASET_KAPASITAS_DATA);
    await submitForm(page);
  },
  { timeout: 30000 }
);

test(
  'Task: Fill Page Info Lainnya',
  async ({ page }) => {
    await navigateToAdmin(page);
    await selectLastProcessingTask(page);
    await fillFormFields(page, INFO_LAINNYA_DATA);
    await submitForm(page);
  },
  { timeout: 30000 }
);

test(
  'Task: Fill Page Data Tambahan',
  async ({ page }) => {
    await navigateToAdmin(page);
    await selectLastProcessingTask(page);
    await page.waitForTimeout(1000);
    await fillFormFields(page, DATA_TAMBAHAN_DATA);
    await submitForm(page);
  },
  { timeout: 30000 }
);

test(
  'Task: Fill Page Penjamin',
  async ({ page }) => {
    await navigateToAdmin(page);
    await selectLastProcessingTask(page);
    await page.waitForTimeout(1000);
    await fillFormFields(page, PENJAMIN_DATA);
    await submitForm(page);
  },
  { timeout: 30000 }
);

test(
  'Task: Fill Page Pembiayaan',
  async ({ page }) => {
    await navigateToAdmin(page);
    await selectLastProcessingTask(page);
    await page.waitForTimeout(1000);
    await fillFormFields(page, PEMBIAYAAN_DATA);
    await submitForm(page);
  },
  { timeout: 30000 }
);

test(
  'Task: Fill Page Penerimaan BPKB',
  async ({ page }) => {
    await navigateToAdmin(page);
    await selectLastProcessingTask(page);
    await page.waitForTimeout(500);
    await fillFormFields(page, PENERIMAAN_BPKB_DATA);
    await submitForm(page);
  },
  { timeout: 30000 }
);
