import { test, expect } from "@playwright/test";
import baseConfig from "../config.js";
import { faker } from "@faker-js/faker/locale/id_ID";
import {
  cleansedName,
  generateLicensePlate,
  StartApplication,
} from "../common";

// const test = base.extend({
//   context: async ({ browser }, use) => {
//     const context = await browser.newContext({
//       extraHTTPHeaders: {
//         "X-User-ID": "000003",
//       },
//     });
//     await use(context);
//     await context.close();
//   },
// });

function escapeCssId(id) {
  return id.replace(/\$/g, "\\$").replace(/\./g, "\\.");
}

test("[DIRECT] Create a credit analysis task", async ({ page }) => {
  const licensePlate = generateLicensePlate();

  const payload = {
    "$.status.application": "pre_approved",
    "$.asset.license_plate": licensePlate,
    "$.customer.ktp.nik": "3173334212960003",
    "$.customer.ktp.name": `${cleansedName(
      faker.person.firstName()
    )} ${cleansedName(faker.person.lastName())}`,
    "$.loan_structure.risk_level": "HIGH",
    "$.loan_structure.product_id": 1,
    "$.process.survey_task.survey_branch_id": "401",
    "$.process.survey_task.surveyor_employee_id": "000004",
    "$.process.operations_task.processing_branch_id": "401",
    "$.submission_date": "2025-04-07T18:00:00Z",
    "$.customer.contact.mobile_number": "+6281234567899",
    "$.customer.ktp.birth_date": "1980-12-03",
    "$.customer.ktp.birth_place": "jakarta",
    "$.customer.ktp.gender": "F",
    "$.customer.professional.npwp": "123123123123123",
    "$.customer.personal.marital_status_code": "M",
    "$.spouse.ktp.nik": "3173334212960003",
    "$.spouse.ktp.name": `${cleansedName(
      faker.person.firstName()
    )} ${cleansedName(faker.person.lastName())}`,
    "$.spouse.mobile_number": "+6281234567890",
    "$.process.survey_task.bpkb_submission.submission_method": "BRANCH_DROPOFF",
    "$.survey_appointment.survey_location_type": "branch",
    "$.customer.personal.number_dependents": 2,
    "$.documents.ktp.document_id": "9888d558-8480-4dbe-95fd-07e2dadbede3",
    "$.documents.kk.document_id": "dc9991b3-a826-481d-bc19-1bdccf555f75",
    "$.documents.selfie.document_id": "17d25972-e99f-4ec0-91d9-540a7090cdb2",
    "$.documents.spouse_ktp.document_id":
      "2e564529-d5b4-407b-adfe-a725d903bb3b",
    "$.documents.asset.selfie_with_vehicle.document_id":
      "49d35413-13d9-4156-bc4e-14978875448c",
    "$.documents.interview.document_id": "4f7a5a7e-32f7-46a9-8c4e-f409bd7e0163",
    "$.documents.npwp.document_id": "4ba5fb49-5cf8-4513-b3be-6eb2664f9b66",
    "$.documents.marriage_certificate.document_id":
      "c168598b-39d7-4164-bb14-cdb1f49ad50b",
    "$.documents.divorce_certificate.document_id":
      "7c5c3f30-5d28-4efb-90a9-1d25c302a668",
    "$.documents.death_certificate.document_id":
      "b01e39bf-4f1d-4c29-87dd-5ef29c4c3bc3",
    "$.documents.debtor_signature.document_id":
      "7119ccfd-d256-4c8e-9ad5-c18387ac42e4",
    "$.documents.spouse_signature.document_id":
      "31156555-2489-4708-bf19-e8f57e4fb390",
    "$.loan_structure.purpose.finance_purpose": "3",
    "$.loan_structure.purpose.finance_purpose_details":
      "Detail Kendaraan untuk Usaha",
    "$.loan_structure.purpose_of_financing": "PRODUCTIVE_LONG",
    "$.process.returning.customer_type": "RO_EXP",
    "$.loan_structure.monthly_installment": 2900000,
    "$.loan_structure.provisional_amount": 10000000,
    "$.loan_structure.original_amount": 18000000,
    "$.customer.domicile.ownership_code": "KL",
    "$.customer.domicile.address.street_address": "Ini alamat yaaaa 192810",
    "$.customer.domicile.stay_since": 2023,
    "$.customer.domicile.bkr_form": "RK_LISTRIK",
    "$.customer.domicile.name_on_bkr": "SUPARMAN",
    "$.documents.house_ownership.document_id":
      "c507e104-36c1-49d6-8d7d-4931fee86559",
    "$.documents.house.document_id": "5142ab92-82b1-49b1-a4dc-4d175ba2a75f",
    "$.asset.asset_code": "DAIHATSU.AYLA.D10AT",
    "$.asset.manufacturing_year": 2021,
    "$.asset.asset_usage": "COMMERCIAL",
    "$.process.asset_pricing.price": 150000000,
    "$.loan_structure.max_funding": 140000000,
    "$.loan_structure.admin_fee": 100000,
    "$.loan_structure.asset_insurance_premium": 100000,
    "$.loan_structure.life_insurance_premium": 100000,
    "$.loan_structure.capitalized_ntf_amount": 100000,
    "$.loan_structure.funding_ratio": 80,
    "$.loan_structure.provision_fee": 100000,
    "$.loan_structure.ltv": 0.7929,
    "$.loan_structure.tenure": 6,
    "$.loan_structure.interest_rate": 0.0312,
    "$.loan_structure.product_offering": 1,
    "$.loan_structure.billing_date": "2025-08-21",
    "$.customer.professional.business_suitability": true,
    "$.process.vehicle_verification_score.s1.max_funding_ratio": 0.8,
    "$.process.pd_model_overlay.s1.max_funding_ratio": 0.76,
    "$.process.loan_estimation.max_funding_ratio": 0.6,
    "$.process.credit_checking.neighborhood.source_1.business_suitability": true,
    "$.asset.bpkb_ownership": "1",
    "$.asset.bpkb_owner_name": "Adhitya",
    "$.documents.asset.asset_front.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.asset.asset_rear.document_id":
      "23828c5e-7c35-4ef1-aea6-72b9305deda7",
    "$.documents.income_proof.document_id":
      "31156555-2489-4708-bf19-e8f57e4fb390",
    "$.documents.business_legality.document_id":
      "31156555-2489-4708-bf19-e8f57e4fb390",
    "$.documents.business_photo.document_id":
      "31156555-2489-4708-bf19-e8f57e4fb390",
    "$.documents.business_location.document_id":
      "31156555-2489-4708-bf19-e8f57e4fb390",
    "$.customer.professional.occupation_type_code": "M",
    "$.customer.professional.occupation_code": "BURARTASRT",
    "$.customer.professional.company_name": "Boyer - Lehner",
    "$.customer.professional.company_address": "jln mangkubumi",
    "$.customer.professional.company_phone": "+628127819287",
    "$.customer.professional.economic_sector": "01",
    "$.customer.professional.industry": "151110-1",
    "$.customer.professional.employment_status": "PERMANENT_EMPLOYEE",
    "$.customer.professional.business_since_year": 2020,
    "$.customer.emergency_contact.name": "Anne Bartoletti",
    "$.customer.emergency_contact.relation_with_customer": "FAMILY",
    "$.customer.emergency_contact.street_address": "Jln Mayang sari IV no 12",
    "$.customer.emergency_contact.mobile_number": "+6281202948172",
    "$.customer.domicile.bkr_period": "2023-01-01",
    "$.process.credit_checking.neighborhood.source_1.information_source":
      "NEIGHBOR",
    "$.process.credit_checking.neighborhood.source_1.informant_name":
      "Kim Jisoo",
    "$.process.credit_checking.neighborhood.source_1.informant_mobile_number":
      "+6281234567890",
    "$.process.credit_checking.neighborhood.source_1.occupation_code":
      "BURARTASRT",
    "$.process.credit_checking.neighborhood.source_1.business_suitability": true,
    "$.process.credit_checking.neighborhood.source_1.family_reputation":
      "POSITIF",
    "$.process.credit_checking.neighborhood.source_1.debtor_spouse_uses_asset_more_than_once": true,
    "$.process.credit_checking.neighborhood.source_1.unit_seen_at_residence_more_than_once": true,
    "$.process.credit_checking.neighborhood.source_1.consumer_often_at_home": true,
    "$.process.credit_checking.neighborhood.source_1.consumer_affiliate_with_organization": false,
    "$.process.credit_checking.neighborhood.source_1.house_suitability": true,
    "$.asset.bpkb_ownership_period": "FROM_1_TO_6_MONTH",
    "$.process.credit_checking.neighborhood.source_1.other_information":
      "Jualan bakso di siang hari, jualan ketoprak di malam hari.",
    "$.process.credit_checking.neighborhood.source_2.information_source":
      "NEIGHBOR",
    "$.process.credit_checking.neighborhood.source_2.informant_name":
      "Kim Jisoo",
    "$.process.credit_checking.neighborhood.source_2.informant_mobile_number":
      "+6281234567890",
    "$.process.credit_checking.neighborhood.source_2.occupation_code":
      "BURARTASRT",
    "$.process.credit_checking.neighborhood.source_2.business_suitability": true,
    "$.process.credit_checking.neighborhood.source_2.family_reputation":
      "POSITIF",
    "$.process.credit_checking.neighborhood.source_2.debtor_spouse_uses_asset_more_than_once": true,
    "$.process.credit_checking.neighborhood.source_2.unit_seen_at_residence_more_than_once": true,
    "$.process.credit_checking.neighborhood.source_2.consumer_often_at_home": true,
    "$.process.credit_checking.neighborhood.source_2.consumer_affiliate_with_organization": false,
    "$.process.credit_checking.neighborhood.source_2.house_suitability": true,
    "$.asset.bpkb_ownership_period": "FROM_1_TO_6_MONTH",
    "$.process.credit_checking.neighborhood.source_2.other_information":
      "Jualan bakso di siang hari, jualan ketoprak di malam hari.",
    "$.process.credit_checking.neighborhood.source_3.information_source":
      "NEIGHBOR",
    "$.process.credit_checking.neighborhood.source_3.informant_name":
      "Kim Jisoo",
    "$.process.credit_checking.neighborhood.source_3.informant_mobile_number":
      "+6281234567890",
    "$.process.credit_checking.neighborhood.source_3.occupation_code":
      "BURARTASRT",
    "$.process.credit_checking.neighborhood.source_3.business_suitability": true,
    "$.process.credit_checking.neighborhood.source_3.family_reputation":
      "POSITIF",
    "$.process.credit_checking.neighborhood.source_3.debtor_spouse_uses_asset_more_than_once": true,
    "$.process.credit_checking.neighborhood.source_3.unit_seen_at_residence_more_than_once": true,
    "$.process.credit_checking.neighborhood.source_3.consumer_often_at_home": true,
    "$.process.credit_checking.neighborhood.source_3.consumer_affiliate_with_organization": false,
    "$.process.credit_checking.neighborhood.source_3.house_suitability": true,
    "$.asset.bpkb_ownership_period": "FROM_1_TO_6_MONTH",
    "$.process.credit_checking.neighborhood.source_3.other_information":
      "Jualan bakso di siang hari, jualan ketoprak di malam hari.",

    "$.branch.branch_id": "401",
    "$.documents.asset_document_status": "IN_TRANSIT_CUSTOMER_TO_BRANCH",
    "$.channel.partner_internal_name": "partner-goto",
    "$.channel.soa_id": "28",
    "$.channel.partner_id": "907d075e-5cef-4179-940e-794946b6eb33",
    "$.asset.bpkb_address": "Perum Taman Bojongsari No.58",
    "$.asset.bpkb_invoice_number": "19069692004JK9012027",
    "$.asset.bpkb_number": "P234567890",
    "$.asset.unit_color": "ABU ABU",
    "$.asset.chassis_number": "MKFKZE81SCJ115045",
    "$.asset.engine_number": "L15Z15605255",
    "$.documents.bpkb_page_1.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.bpkb_page_2.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.bpkb_page_3.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.bpkb_page_4.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.bpkb_page_5.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.bpkb_invoice.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.bpkb_receipt_2.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.customer_receipt_2.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.payment_receipt.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.invoice.document_id": "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.stnk.document_id": "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.customer.domicile.address.sub_district_code": "15.07.02.2008",
    "$.customer.domicile.address.rt": "001",
    "$.customer.domicile.address.rw": "001",
    "$.documents.asset.asset_front_right_side.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.asset.asset_front_left_side.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.asset.asset_rear_right_side.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.asset.asset_rear_left_side.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.asset.asset_interior_center_sid.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.asset.asset_left_side.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.asset.asset_right_side.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.asset.engine_number.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.asset.speedometer.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.vehicle_inspection.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.ktp_bpkb.document_id": "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.chassis_number.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.tax_notice.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.release_letter.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.channel.marketing_id": "2403NC0005",
    "$.customer.emergency_contact.rt": "001",
    "$.customer.emergency_contact.rw": "002",
    "$.asset.bpkb_status": "on_hand",
    "$.customer.professional.is_profession_valid": true,
    "$.customer.professional.company_sub_district_code": "15.07.02.2008",
    "$.survey_appointment.preferred_timezone": "Asia/Jakarta",
    "$.documents.employment_evidence.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.business_legality.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.business_photo.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    "$.documents.business_location.document_id":
      "ed668a54-93ec-4f36-a888-f84007baf190",
    // additional data for follow up bpkb
    "$.survey_appointment.survey_type": "REGULAR",
    "$.documents.guarantor_identity_card.document_id":
      "9888d558-8480-4dbe-95fd-07e2dadbede3",
    "$.documents.guarantor_identity_card_2.document_id":
      "9888d558-8480-4dbe-95fd-07e2dadbede3",
    "$.documents.guarantor_identity_card_3.document_id":
      "9888d558-8480-4dbe-95fd-07e2dadbede3",
    "$.documents.guarantor_house_ownership.document_id":
      "c507e104-36c1-49d6-8d7d-4931fee86559",
    "$.documents.guarantor_house_ownership_2.document_id":
      "c507e104-36c1-49d6-8d7d-4931fee86559",
    "$.documents.guarantor_house_ownership_3.document_id":
      "c507e104-36c1-49d6-8d7d-4931fee86559",
    "$.documents.guarantor_additional_document.document_id":
      "c507e104-36c1-49d6-8d7d-4931fee86559",
    "$.documents.guarantor_additional_document_2.document_id":
      "c507e104-36c1-49d6-8d7d-4931fee86559",
    "$.documents.guarantor_additional_document_3.document_id":
      "c507e104-36c1-49d6-8d7d-4931fee86559",
    "$.documents.guarantor_family_card.document_id":
      "c507e104-36c1-49d6-8d7d-4931fee86559",
    "$.documents.guarantor_family_card_2.document_id":
      "c507e104-36c1-49d6-8d7d-4931fee86559",
    "$.documents.guarantor_family_card_3.document_id":
      "c507e104-36c1-49d6-8d7d-4931fee86559",
    "$.guarantor.nik": "3173334212960003",
    "$.guarantor.name": "Joko Subianto",
    "$.guarantor.birth_place": "Magelang",
    "$.guarantor.birth_date": "1999-02-02",
    "$.guarantor.gender": "M",
    "$.guarantor.street_address": "Jalan Satu Dua Tiga",
    "$.guarantor.sub_district_code": "12.71.05.1002",
    "$.guarantor.rt": "001",
    "$.guarantor.rw": "002",
    "$.guarantor.mobile_number": "+6281234567890",
    "$.guarantor.marital_status_code": "S",
    "$.guarantor.monthly_income": "2000000",
    "$.guarantor.relation_with_customer_code": "CH",
    "$.guarantor.occupation_type_code": "B",
    "$.guarantor.occupation_code": "BURARTASRT",
    "$.guarantor.domicile.street_address": "Jalan Empat Lima Enam",
    "$.guarantor.domicile.sub_district_code": "12.71.05.1004",
    "$.guarantor.domicile.rt": "001",
    "$.guarantor.domicile.rw": "002",
    "$.guarantor_2.nik": "3173334212960003",
    "$.guarantor_2.name": "Joko Subianto",
    "$.guarantor_2.birth_place": "Magelang",
    "$.guarantor_2.birth_date": "1999-02-02",
    "$.guarantor_2.gender": "M",
    "$.guarantor_2.street_address": "Jalan Satu Dua Tiga",
    "$.guarantor_2.sub_district_code": "12.71.05.1002",
    "$.guarantor_2.rt": "001",
    "$.guarantor_2.rw": "002",
    "$.guarantor_2.mobile_number": "+6281234567890",
    "$.guarantor_2.marital_status_code": "S",
    "$.guarantor_2.monthly_income": "2000000",
    "$.guarantor_2.relation_with_customer_code": "CH",
    "$.guarantor_2.occupation_type_code": "B",
    "$.guarantor_2.occupation_code": "BURARTASRT",
    "$.guarantor_2.domicile.street_address": "Jalan Empat Lima Enam",
    "$.guarantor_2.domicile.sub_district_code": "12.71.05.1004",
    "$.guarantor_2.domicile.rt": "001",
    "$.guarantor_2.domicile.rw": "002",
    "$.guarantor_3.nik": "3173334212960003",
    "$.guarantor_3.name": "Joko Subianto",
    "$.guarantor_3.birth_place": "Magelang",
    "$.guarantor_3.birth_date": "1999-02-02",
    "$.guarantor_3.gender": "M",
    "$.guarantor_3.street_address": "Jalan Satu Dua Tiga",
    "$.guarantor_3.sub_district_code": "12.71.05.1002",
    "$.guarantor_3.rt": "001",
    "$.guarantor_3.rw": "002",
    "$.guarantor_3.mobile_number": "+6281234567890",
    "$.guarantor_3.marital_status_code": "S",
    "$.guarantor_3.monthly_income": "2000000",
    "$.guarantor_3.relation_with_customer_code": "CH",
    "$.guarantor_3.occupation_type_code": "B",
    "$.guarantor_3.occupation_code": "BURARTASRT",
    "$.guarantor_3.domicile.street_address": "Jalan Empat Lima Enam",
    "$.guarantor_3.domicile.sub_district_code": "12.71.05.1004",
    "$.guarantor_3.domicile.rt": "001",
    "$.guarantor_3.domicile.rw": "002",
    "$.process.survey_task.bpkb_submission.verificator_notes": "oke",
    "$.guarantor.citizenship": "WNI",
    "$.guarantor_2.citizenship": "WNI",
    "$.guarantor_3.citizenship": "WNI",
    "$.guarantor.type": "PERORANGAN",
    "$.guarantor_2.type": "PERORANGAN",
    "$.guarantor_3.type": "PERORANGAN",
  };

  const { workflowId, start } = await StartApplication();
  try {
    await start;
    await fetch(`${baseConfig.lgs_base_url}/application/${workflowId}/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log(`✔ Task generated with workflowId: ${workflowId}`);
    console.log(`✔ License plate: ${payload["$.asset.license_plate"]}`);
    console.log(`✔ Customer name: ${payload["$.customer.ktp.name"]}`);

    await page.waitForTimeout(15000);
    await navigateToCa(page);
  } catch (error) {
    console.error(error);
  }
});

async function selectFirstUnassignedTask(page) {
  const task = await page.locator("#task-list table tbody tr").first();
  await task.click();
}
async function selectLastUnassignedTask(page) {
  const task = await page.locator("#task-list table tbody tr").last();
  await task.click();
}

// Common setup and navigation functions
async function navigateToCa(page) {
  await page.goto("http://localhost:3000/credit-analysis");
}

async function forwardForm(page, timeout = 5000) {
  const submitButton = page.locator(
    'button[name="action"][type="submit"][value="forward"]'
  );
  await submitButton.waitFor({ state: "visible" });

  let isLoading = (await submitButton.getAttribute("data-loading")) === "true";
  if (isLoading) {
    await page.waitForTimeout(timeout);
  }
  await submitButton.click();
  await page.waitForTimeout(timeout);
}

async function submitForm(page, timeout = 5000) {
  const submitButton = page.locator(
    'button[name="action"][type="submit"][value="submit"]'
  );
  await submitButton.waitFor({ state: "visible" });

  let isLoading = (await submitButton.getAttribute("data-loading")) === "true";
  if (isLoading) {
    await page.waitForTimeout(timeout);
  }
  await submitButton.click();
  await page.waitForTimeout(timeout);
}

async function moveToMyTaskTab(page) {
  const tab = page.getByRole("tab", { name: /tugas saya/i });
  await tab.click();
}

async function submitSelfAssign(page, timeout = 5000) {
  const submitButton = page.locator(
    'button[name="action"][type="submit"][value="assign"]'
  );
  await submitButton.waitFor({ state: "visible" });

  let isLoading = (await submitButton.getAttribute("data-loading")) === "true";
  if (isLoading) {
    await page.waitForTimeout(timeout);
  }
  await submitButton.click();
  await page.waitForTimeout(timeout);
}

// Reusable form filling function
async function fillFormFields(page, formData) {
  for (const field of formData) {
    try {
      if (field.type === "input") {
        const locator = field.selector
          ? page.locator(field.selector)
          : page.locator(`#${escapeCssId(field.id)}`);
        await locator.fill(field.value);
        console.log(
          `Filled input: ${field.id || field.selector} with ${field.value}`
        );
      } else if (field.type === "select") {
        const locator = field.selector
          ? page.locator(field.selector)
          : page.locator(`#${escapeCssId(field.id)}`);
        await locator.selectOption(field.value);
        console.log(
          `Selected option: ${field.id || field.selector} = ${field.value}`
        );
      } else if (field.type === "radio") {
        const radioLocator = field.selector
          ? page.locator(field.selector)
          : page.locator(
              `input[name="${escapeCssId(field.name)}"][value="${field.value}"]`
            );
        await radioLocator.check();
        console.log(`Checked radio: ${field.name} = ${field.value}`);
      } else if (field.type === "checkbox") {
        const checkboxLocator = field.selector
          ? page.locator(field.selector)
          : page.locator(
              `input[id="${escapeCssId(`${field.id}`)}"][value="${
                field.value
              }"]`
            );
        await checkboxLocator.check();
        console.log(`Checked checkbox: ${field.name} = ${field.value}`);
      } else if (field.type === "file") {
        const fileInput = field.selector
          ? page.locator(field.selector)
          : page.locator(`#${escapeCssId(field.id)} input[type="file"]`);
        await fileInput.setInputFiles(field.filePath);
        console.log(`Uploaded file: ${field.id || field.selector}`);
        if (field.delay) await page.waitForTimeout(field.delay);
      } else if (field.type === "button") {
        const button = page.locator(field.selector);
        await button.click();
        console.log(`Clicked button: ${field.selector}`);
      } else if (field.type === "custom" && field.callback) {
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

const FORM_PAGE_PROFILE_ALL_TRUE = [
  {
    id: "$.ltw.customer_ktp_nik_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.customer_ktp_name_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.customer_ktp_birth_place_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.customer_ktp_birth_date_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.customer_ktp_gender_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.customer_marital_status_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.spouse_ktp_name_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.spouse_ktp_nik_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.spouse_mobile_number_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.ktp_document_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.kk_document_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.npwp_document_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.selfie_document_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.interview_document_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.death_certificate_document_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.signature_document_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.ktp_spouse_document_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.married_certificate_document_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
  {
    id: "$.ltw.spouse_signature_document_revision_checkbox__overlay",
    value: "true",
    type: "checkbox",
  },
];

const FORM_PAGE_CHARACTER_ALL_TRUE = [
  {
    id: "$.underwriting.character.pefindo_max_past_due_last_6_month",
    type: "input",
    value: "1",
  },
  {
    id: "$.underwriting.character.pefindo_rating",
    type: "select",
    value: "COLL2",
  },
  {
    id: "$.underwriting.character.pefindo_total_active_contract",
    type: "input",
    value: "1",
  },
  {
    id: "$.underwriting.character.other_financing_record",
    type: "input",
    value: "1",
  },
  {
    id: "$.underwriting.character.ro_bfi_expired_contract",
    type: "input",
    value: "1",
  },
  {
    id: "$.underwriting.character.ro_bfi_total_active_contract",
    type: "input",
    value: "1",
  },
  {
    id: "$.underwriting.character.ro_bfi_rating_consumer",
    type: "select",
    value: "2",
  },
  {
    id: "$.underwriting.character.ro_bfi_max_past_due",
    type: "input",
    value: "1",
  },
  {
    id: "$.underwriting.character.ro_bfi_max_past_due_active_contract",
    type: "input",
    value: "1",
  },
  {
    type: "custom",
    callback: async (page) => {
      await page
        .locator("#\\$\\.underwriting\\.character\\.pefindo_last_update")
        .fill("2025-10-16");
      await page
        .locator(
          "#\\$\\.underwriting\\.character\\.ro_bfi_final_date_of_max_past_due"
        )
        .fill("2025-10-16");
      await page
        .locator(
          "#\\$\\.underwriting\\.character\\.ro_bfi_final_date_of_max_past_due_active_contract"
        )
        .fill("2025-10-16");
    },
  },
];

const FORM_PAGE_COLLATERAL = [
  {
    id: "$.underwriting.collateral.unit_user",
    type: "select",
    value: "DEBTOR",
  },
  {
    id: "$.underwriting.collateral.total_contracts_in_submission",
    type: "input",
    value: "1",
  },
  {
    name: "$.underwriting.collateral.asset_category",
    type: "radio",
    value: "A",
  },
];

const FORM_PAGE_CAPACITY = [
  {
    name: "$.underwriting.capacity.consumer_work_location_minimum_wage_type",
    type: "radio",
    value: "UMP",
  },
  {
    id: "$.underwriting.capacity.consumer_work_location_minimum_wage_type",
    type: "select",
    value: "Bali",
  },
  {
    name: "$.underwriting.capacity.spouse_work_location_minimum_wage_type",
    type: "select",
    value: "Bali",
  },
  {
    id: "$.underwriting.capacity.spouse_work_location_minimum_wage_type",
    type: "select",
    value: "Bali",
  },
  {
    id: "$.underwriting.capacity.consumer_occupation",
    type: "select",
    value: "Profesional/Wiraswasta",
  },
];

// Refactored Tests
test("Task: assign to self", async ({ page }) => {
  await navigateToCa(page);
  await selectFirstUnassignedTask(page);
  await submitSelfAssign(page, 5000);
});

test("Task: fill profile form", async ({ page }) => {
  await navigateToCa(page);
  await moveToMyTaskTab(page);
  await selectLastUnassignedTask(page);
  await page.waitForTimeout(5000);

  await fillFormFields(page, FORM_PAGE_PROFILE_ALL_TRUE);

  await forwardForm(page, 5000);
  await forwardForm(page, 5000);
});

test("Task: fill character form", async ({ page }) => {
  await navigateToCa(page);
  await moveToMyTaskTab(page);
  await selectLastUnassignedTask(page);
  await page.waitForTimeout(5000);

  await fillFormFields(page, FORM_PAGE_CHARACTER_ALL_TRUE);

  await forwardForm(page, 5000);
  await forwardForm(page, 5000);
});

test("Task: fill colateral form", async ({ page }) => {
  await navigateToCa(page);
  await moveToMyTaskTab(page);
  await selectLastUnassignedTask(page);
  await page.waitForTimeout(5000);

  await fillFormFields(page, FORM_PAGE_COLLATERAL);

  await forwardForm(page, 5000);
});
