export const dataTypes = {
  'list': {
    'mysql': 'VARCHAR(255)',
    'formSchemaTemplate': {
      'type': 'string',
      'x-display': 'autocomplete',
      'x-fromData': 'context.options',
      'x-itemKey': 'value',
      'x-itemTitle': 'text'
    }
  },
  'user': {
    'mysql': 'BIGINT',
    'formSchemaTemplate': {
      'type': 'integer',
      'x-display': 'custom-user',
      'x-fromData': 'context.users',
      'x-itemKey': 'val',
      'x-itemTitle': 'label'
    }
  },
  'patient': {
    'mysql': 'BIGINT',
    'formSchemaTemplate': {
      'type': 'integer',
      'x-display': 'custom-patient',
      'x-fromData': 'context.patient',
      'x-itemKey': 'val',
      'x-itemTitle': 'label'
    },
    'databaseColumns': [{ 'name': 'id', 'type': 'integer', 'comment': null, 'extra': [] }, {
      'name': 'uuid',
      'type': 'boolean',
      'comment': null,
      'extra': []
    }, { 'name': 'title', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'lang',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'financial', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'fname',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'lname', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'mname',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'DOB', 'type': 'date', 'comment': null, 'extra': [] }, {
      'name': 'street',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'postal_code', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'city',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'state', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'country_code',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'drivers_license', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'ss',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'occupation', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'phone_home',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'phone_biz', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'phone_contact',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'phone_cell', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'pharmacy_id',
      'type': 'integer',
      'comment': null,
      'extra': []
    }, { 'name': 'status', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'contact_relationship',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'date', 'type': 'datetime', 'comment': null, 'extra': [] }, {
      'name': 'sex',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'referrer', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'referrerID',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'providerID', 'type': 'integer', 'comment': null, 'extra': [] }, {
      'name': 'ref_providerID',
      'type': 'integer',
      'comment': null,
      'extra': []
    }, { 'name': 'email', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'email_direct',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'ethnoracial', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'race',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'ethnicity', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'religion',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'interpretter', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'migrantseasonal',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'family_size', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'monthly_income',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'billing_note', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'homeless',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'financial_review', 'type': 'datetime', 'comment': null, 'extra': [] }, {
      'name': 'pubpid',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'pid', 'type': 'integer', 'comment': null, 'extra': [] }, {
      'name': 'gender_identity',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'genericval1', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'Secondary_Insurance',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'Insurance_Notes', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'hipaa_mail',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'hipaa_voice', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'hipaa_notice',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'hipaa_message', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'hipaa_allowsms',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'hipaa_allowemail', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'squad',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'fitness', 'type': 'integer', 'comment': null, 'extra': [] }, {
      'name': 'referral_source',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'usertext1', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'usertext2',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'usertext3', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'usertext4',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'usertext5', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'usertext6',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'usertext7', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'usertext8',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'userlist1', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'userlist2',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'userlist3', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'userlist4',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'userlist5', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'userlist6',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'userlist7', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'pricelevel',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'regdate', 'type': 'date', 'comment': null, 'extra': [] }, {
      'name': 'contrastart',
      'type': 'date',
      'comment': null,
      'extra': []
    }, { 'name': 'completed_ad', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'ad_reviewed',
      'type': 'date',
      'comment': null,
      'extra': []
    }, { 'name': 'vfc', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'mothersname',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'guardiansname', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'allow_imm_reg_use',
      'type': 'string',
      'comment': null,
      'extra': []
    }, {
      'name': 'allow_imm_info_share',
      'type': 'string',
      'comment': null,
      'extra': []
    }, {
      'name': 'allow_health_info_ex',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'allow_patient_portal', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'deceased_date',
      'type': 'datetime',
      'comment': null,
      'extra': []
    }, { 'name': 'deceased_reason', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'soap_import_status',
      'type': null,
      'comment': null,
      'extra': []
    }, { 'name': 'cmsportal_login', 'type': 'string', 'comment': null, 'extra': [] }, {
      'name': 'care_team_provider',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'care_team_facility', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'county',
      'type': 'string',
      'comment': null,
      'extra': []
    }, { 'name': 'industry', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'imm_reg_status',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'imm_reg_stat_effdate', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'publicity_code',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'publ_code_eff_date', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'protect_indicator',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'prot_indi_effdate', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'guardianrelationship',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'guardiansex', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'guardianaddress',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'guardiancity', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'guardianstate',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'guardianpostalcode', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'guardiancountry',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'guardianphone', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'guardianworkphone',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'guardianemail', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'AHCCCS__',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'AHCCCS_Plan', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'Insurance_Updated_By',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'Alias', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'Insurance_Updated_Date',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'RHBA_Provider', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'RHBA_ProviderYN',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'MacPrac', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'AHCCCS_Physical_Heal',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'EC_2', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'PC_2',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'Other_Clinic', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'Referral_Name',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'preferredpronouns', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'Primary_Insurance',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'Primary_Ins_ID', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'sexual_orientation',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'NextStepID', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'transmit_to_ns',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'smigmhclinic', 'type': 'text', 'comment': null, 'extra': [] }, {
      'name': 'alert',
      'type': 'text',
      'comment': null,
      'extra': []
    }, { 'name': 'language', 'type': 'text', 'comment': null, 'extra': [] }],
    'customFilters': { 'isHighUtilizer': { 'title': 'High Utilizer', 'endpoint': '\/api\/apis\/is_high_utilizer' } }
  },
  'string': {
    'mysql': 'VARCHAR(255)',
    'formSchemaTemplate': { 'type': 'string', 'title': 'I\'m a string', 'format': 'string' }
  },
  'text': {
    'mysql': 'LONGTEXT',
    'formSchemaTemplate': { 'type': 'string', 'title': 'I\'m a string in a textarea', 'x-display': 'textarea' }
  },
  'integer': { 'mysql': 'BIGINT', 'formSchemaTemplate': { 'type': 'integer' } },
  'boolean': {
    'mysql': 'BOOLEAN',
    'formSchemaTemplate': {
      'type': 'boolean',
      'title': 'I\'m a boolean',
      'x-display': 'switch',
      'description': 'This description is used as a help message.'
    }
  },
  'date': { 'mysql': 'DATE', 'formSchemaTemplate': { 'type': 'string', 'format': 'date' } },
  'datetime': { 'mysql': 'DATETIME', 'formSchemaTemplate': { 'type': 'string', 'format': 'date-time' } }
}
