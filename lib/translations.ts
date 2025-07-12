// Translation system for Arabic and English support

export type Language = "en" | "ar"

export interface TranslationKeys {
  // Navigation & General
  dashboard: string
  login: string
  logout: string
  welcome: string
  loading: string
  save: string
  cancel: string
  delete: string
  edit: string
  add: string
  create: string
  update: string
  search: string
  filter: string
  export: string
  import: string
  settings: string
  profile: string
  help: string
  back: string
  next: string
  previous: string
  close: string
  confirm: string
  view: string
  manage: string
  new: string
  read: string
  unread: string
  mark: string
  recent: string
  latest: string
  generating: string
  generate: string
  details: string
  download: string
  refresh: string
  overview: string
  month: string
  months: string

  // User Management
  users: string
  employees: string
  companies: string
  email: string
  password: string
  role: string
  permissions: string
  status: string
  active: string
  inactive: string

  // Business Modules
  invoices: string
  inventory: string
  warehouses: string
  reports: string
  debts: string
  payments: string
  sales: string
  purchases: string

  // AI & Forecasting
  ai_forecasting: string
  ai_insights: string
  forecasting: string
  predictions: string
  trends: string
  analysis: string
  recommendations: string
  confidence: string
  generate_report: string
  sales_forecast: string
  inventory_analysis: string
  debt_analysis: string
  revenue_forecast: string

  // Accounting Modules
  general_ledger: string
  chart_of_accounts: string
  journal_entries: string
  accounts_receivable: string
  accounts_payable: string
  cash_bank: string
  fixed_assets: string
  hr_payroll: string
  tax_management: string
  financial_reports: string
  accounting_modules: string
  accounting_modules_desc: string
  features: string
  request_access: string
  roles_permissions: string
  roles_permissions_desc: string
  general_ledger_desc: string
  accounts_receivable_desc: string
  accounts_payable_desc: string
  inventory_management_desc: string
  purchasing_desc: string
  sales_desc: string
  hr_payroll_desc: string
  cash_bank_desc: string
  fixed_assets_desc: string
  tax_management_desc: string
  financial_reports_desc: string

  // Data & Analytics
  total: string
  amount: string
  price: string
  date: string
  period: string
  growth: string
  decline: string
  stable: string
  high: string
  medium: string
  low: string
  critical: string

  // Messages & Alerts
  success: string
  error: string
  warning: string
  info: string
  no_data: string
  data_updated: string
  operation_successful: string
  operation_failed: string

  // Time & Dates
  today: string
  yesterday: string
  this_week: string
  this_month: string
  this_year: string
  last_month: string
  last_year: string

  // Actions
  analyze: string
  forecast: string
  upload: string
  sync: string

  // AI Specific
  ai_analysis: string
  machine_learning: string
  predictive_analytics: string
  business_intelligence: string
  data_insights: string
  automated_reports: string
  smart_recommendations: string
  trend_analysis: string
  anomaly_detection: string
  performance_metrics: string

  // Accounting Specific
  debit: string
  credit: string
  balance: string
  account: string
  transaction: string
  customer: string
  supplier: string
  vendor: string
  asset: string
  liability: string
  equity: string
  revenue: string
  expense: string
  profit_loss: string
  balance_sheet: string
  cash_flow: string
  trial_balance: string
  aging_report: string
  reconciliation: string
  depreciation: string
  tax: string
  vat: string
  payroll: string
  salary: string
  allowance: string
  deduction: string

  // Journal Entries UI
  no_access: string
  add_entry: string
  edit_entry: string
  entries_list: string
  journal_entries_desc: string
  lines: string
  description: string
  delete_entry_confirm: string
  no_access_ap: string
  purchase_invoices: string
  manage_supplier_invoices: string
  add_invoice: string
  invoice_number: string
  supplier: string
  total: string
  actions: string
  supplier_payments: string
  manage_payments_to_suppliers: string
  add_payment: string
  amount: string
  invoice: string
  method: string
  edit_invoice: string
  form_coming_soon: string
  edit_payment: string
  add_payment: string
  full_access: string
  no_access: string
  view_only: string
  features_available: string
  access_summary: string
  account_information: string
  account_details_permissions: string
  unique_key: string
  account_expires: string
  never: string
  your_permissions: string
  what_you_can_access: string
  no_permissions_assigned: string
  contact_admin_request_access: string
  available: string
  access: string
  debt_management: string
  track_manage_debts: string
  manage_employee_info: string
  handle_company_invoices: string
  track_inventory_items: string
  manage_warehouse_locations: string
  view_business_reports: string
  permission_view_sales: string
  permission_manage_sales: string
  permission_view_reports: string
  permission_view_invoices: string
  permission_view_cash_bank: string
  permission_view_employees: string
  permission_view_inventory: string
  permission_manage_invoices: string
  permission_view_hr_payroll: string
  permission_view_purchasing: string
  permission_view_warehouses: string
  permission_manage_cash_bank: string
  permission_manage_employees: string
  permission_manage_inventory: string
  permission_manage_hr_payroll: string
  permission_manage_purchasing: string
  permission_manage_warehouses: string
  permission_view_fixed_assets: string
  permission_manage_fixed_assets: string
  permission_view_general_ledger: string
  permission_view_tax_management: string
  permission_manage_general_ledger: string
  permission_manage_tax_management: string
  permission_view_accounts_payable: string
  permission_view_financial_reports: string
  permission_view_roles_permissions: string
  permission_manage_accounts_payable: string
  permission_manage_financial_reports: string
  permission_manage_roles_permissions: string
  permission_view_accounts_receivable: string
  permission_manage_accounts_receivable: string
  employees_management: string
  manage_employee_info_records: string
  view_employee_info: string
  add_employee: string
  search_employees: string
  loading_employees: string
  no_employees_found_search: string
  no_employees_found: string
  employee_number: string
  name: string
  position: string
  department: string
  salary: string
  hire_date: string
  status: string
  actions: string
  failed_save_employee: string
  error_save_employee: string
  invoices_management: string
  manage_company_invoices_billing: string
  view_company_invoices: string
  create_invoice: string
  search_invoices: string
  loading_invoices: string
  no_invoices_found_search: string
  no_invoices_found: string
  invoice_number: string
  client: string
  amount: string
  invoice_status: string
  issue_date: string
  due_date: string
  pending: string
  paid: string
  overdue: string
  failed_save_invoice: string
  error_save_invoice: string
  inventory_management_module_access: string
  products: string
  manage_inventory_products: string
  add_product: string
  sku: string
  unit: string
  active: string
  inactive: string
  warehouses: string
  manage_inventory_warehouses: string
  add_warehouse: string
  location: string
  edit_product: string
  edit_warehouse: string
  form_coming_soon: string
  cancel: string
  save: string
  you_do_not_have_access_warehouses: string
  warehouses_management: string
  manage_warehouse_locations_inventory: string
  view_warehouse_info: string
  search_warehouses: string
  loading_warehouses: string
  no_warehouses_found_search: string
  no_warehouses_found: string
  warehouse_number: string
  inventory: string
  manage_inventory_items: string
  add_inventory_item: string
  search_inventory: string
  loading_inventory: string
  no_inventory_found_search: string
  no_inventory_found: string
  item_name: string
  item_code: string
  quantity: string
  unit_price: string
  category: string
  transfer_inventory: string
  sale: string
  debt_sale: string
  client_name: string
  debtor_name: string
  debtor_type: string
  debtor_contact: string
  due_date: string
  notes: string
  unknown_item: string
  please_add_valid_item_sale: string
  please_add_valid_item_debt_sale: string
  failed_save_warehouse: string
  error_save_warehouse: string
  failed_add_inventory_item: string
  error_add_inventory_item: string
  failed_transfer_inventory: string
  error_transfer_inventory: string
  failed_complete_sale: string
  error_complete_sale: string
  failed_complete_debt_sale: string
  error_complete_debt_sale: string
  business_reports_analytics: string
  overview_key_metrics: string
  total_employees: string
  total_revenue: string
  total_invoices: string
  inventory_items: string
  warehouses_card: string
  active_employees: string
  total_revenue_paid_invoices: string
  pending_overdue: string
  items_low_stock: string
  active_warehouse_locations: string
  overdue_invoices: string
  invoices_overdue_attention: string
  low_stock_alert: string
  items_running_low_stock: string
  pending_invoices: string
  invoices_pending_payment: string
  alerts_notifications: string
  important_items_attention: string
  action_required: string
  info: string
  summary: string
  quick_overview_status: string
  loading_reports: string
  total_debts: string
  active_debt: string
  overdue_debt: string
  paid_debt: string
  written_off: string
  debtor_contact: string
  total_amount: string
  remaining_amount: string
  record_payment: string
  payment_history: string
  search_debts: string
  loading_debts: string
  no_debts_found_search: string
  no_debts_found: string
  payment_amount: string
  payment_date: string
  payment_method: string
  reference_number: string
  save_payment: string
  failed_record_payment: string
  error_record_payment: string
}

const translations: Record<Language, TranslationKeys> = {
  en: {
    // Navigation & General
    dashboard: "Dashboard",
    login: "Login",
    logout: "Logout",
    welcome: "Welcome",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    create: "Create",
    update: "Update",
    search: "Search",
    filter: "Filter",
    export: "Export",
    import: "Import",
    settings: "Settings",
    profile: "Profile",
    help: "Help",
    back: "Back",
    next: "Next",
    previous: "Previous",
    close: "Close",
    confirm: "Confirm",
    view: "View",
    manage: "Manage",
    new: "New",
    read: "Read",
    unread: "Unread",
    mark: "Mark",
    recent: "Recent",
    latest: "Latest",
    generating: "Generating",
    generate: "Generate",
    details: "Details",
    download: "Download",
    refresh: "Refresh",
    overview: "Overview",
    month: "Month",
    months: "Months",

    // User Management
    users: "Users",
    employees: "Employees",
    companies: "Companies",
    email: "Email",
    password: "Password",
    role: "Role",
    permissions: "Permissions",
    status: "Status",
    active: "Active",
    inactive: "Inactive",

    // Business Modules
    invoices: "Invoices",
    inventory: "Inventory",
    warehouses: "Warehouses",
    reports: "Reports",
    debts: "Debts",
    payments: "Payments",
    sales: "Sales",
    purchases: "Purchases",

    // AI & Forecasting
    ai_forecasting: "AI & Forecasting",
    ai_insights: "AI Insights",
    forecasting: "Forecasting",
    predictions: "Predictions",
    trends: "Trends",
    analysis: "Analysis",
    recommendations: "Recommendations",
    confidence: "Confidence",
    generate_report: "Generate Report",
    sales_forecast: "Sales Forecast",
    inventory_analysis: "Inventory Analysis",
    debt_analysis: "Debt Analysis",
    revenue_forecast: "Revenue Forecast",

    // Accounting Modules
    general_ledger: "General Ledger",
    chart_of_accounts: "Chart of Accounts",
    journal_entries: "Journal Entries",
    accounts_receivable: "Accounts Receivable",
    accounts_payable: "Accounts Payable",
    cash_bank: "Cash & Bank",
    fixed_assets: "Fixed Assets",
    hr_payroll: "HR & Payroll",
    tax_management: "Tax Management",
    financial_reports: "Financial Reports",
    accounting_modules: "Accounting Modules",
    accounting_modules_desc: "Complete accounting system with all essential modules for business management",
    features: "Features:",
    request_access: "Request Access",
    roles_permissions: "Roles & Permissions",
    roles_permissions_desc: "User access control and audit trail",
    general_ledger_desc: "Hierarchical chart of accounts, journal entries, and balance calculations",
    accounts_receivable_desc: "Customer invoicing, payments tracking, and aging reports",
    accounts_payable_desc: "Supplier invoice management and payment scheduling",
    inventory_management_desc: "Complete inventory control and warehouse management",
    purchasing_desc: "Purchase order management and supplier relations",
    sales_desc: "Sales order processing and customer management",
    hr_payroll_desc: "Employee management and payroll processing",
    cash_bank_desc: "Cash flow management and bank reconciliation",
    fixed_assets_desc: "Asset tracking and depreciation management",
    tax_management_desc: "Tax calculation and compliance management",
    financial_reports_desc: "Comprehensive financial reporting and dashboards",

    // Data & Analytics
    total: "Total",
    amount: "Amount",
    price: "Price",
    date: "Date",
    period: "Period",
    growth: "Growth",
    decline: "Decline",
    stable: "Stable",
    high: "High",
    medium: "Medium",
    low: "Low",
    critical: "Critical",

    // Messages & Alerts
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",
    no_data: "No data available",
    data_updated: "Data updated successfully",
    operation_successful: "Operation completed successfully",
    operation_failed: "Operation failed",

    // Time & Dates
    today: "Today",
    yesterday: "Yesterday",
    this_week: "This Week",
    this_month: "This Month",
    this_year: "This Year",
    last_month: "Last Month",
    last_year: "Last Year",

    // Actions
    analyze: "Analyze",
    forecast: "Forecast",
    upload: "Upload",
    sync: "Sync",

    // AI Specific
    ai_analysis: "AI Analysis",
    machine_learning: "Machine Learning",
    predictive_analytics: "Predictive Analytics",
    business_intelligence: "Business Intelligence",
    data_insights: "Data Insights",
    automated_reports: "Automated Reports",
    smart_recommendations: "Smart Recommendations",
    trend_analysis: "Trend Analysis",
    anomaly_detection: "Anomaly Detection",
    performance_metrics: "Performance Metrics",

    // Accounting Specific
    debit: "Debit",
    credit: "Credit",
    balance: "Balance",
    account: "Account",
    transaction: "Transaction",
    customer: "Customer",
    supplier: "Supplier",
    vendor: "Vendor",
    asset: "Asset",
    liability: "Liability",
    equity: "Equity",
    revenue: "Revenue",
    expense: "Expense",
    profit_loss: "Profit & Loss",
    balance_sheet: "Balance Sheet",
    cash_flow: "Cash Flow",
    trial_balance: "Trial Balance",
    aging_report: "Aging Report",
    reconciliation: "Reconciliation",
    depreciation: "Depreciation",
    tax: "Tax",
    vat: "VAT",
    payroll: "Payroll",
    salary: "Salary",
    allowance: "Allowance",
    deduction: "Deduction",

    // Journal Entries UI
    no_access: "You do not have access to this module.",
    add_entry: "Add Entry",
    edit_entry: "Edit Entry",
    entries_list: "Entries List",
    journal_entries_desc: "All journal entries for your company. Each entry must have at least two lines (debit/credit).",
    lines: "Lines",
    description: "Description",
    delete_entry_confirm: "Delete this entry?",
    no_access_ap: "You do not have access to Accounts Payable module.",
    purchase_invoices: "Purchase Invoices",
    manage_supplier_invoices: "Manage supplier invoices",
    add_invoice: "Add Invoice",
    invoice_number: "Invoice #",
    supplier: "Supplier",
    total: "Total",
    actions: "Actions",
    supplier_payments: "Supplier Payments",
    manage_payments_to_suppliers: "Manage payments to suppliers",
    add_payment: "Add Payment",
    amount: "Amount",
    invoice: "Invoice",
    method: "Method",
    edit_invoice: "Edit Invoice",
    form_coming_soon: "Form coming soon",
    edit_payment: "Edit Payment",
    add_payment: "Add Payment",
    full_access: "Full Access",
    no_access: "No Access",
    view_only: "View Only",
    features_available: "{count} features available",
    access_summary: "Access Summary",
    account_information: "Account Information",
    account_details_permissions: "Your account details and permissions",
    unique_key: "Unique Key",
    account_expires: "Account Expires",
    never: "Never",
    your_permissions: "Your {permissions}",
    what_you_can_access: "What you can access in the system",
    no_permissions_assigned: "No permissions assigned",
    contact_admin_request_access: "Contact your company admin to request access",
    available: "Available",
    access: "Access",
    debt_management: "Debt Management",
    track_manage_debts: "Track and manage outstanding debts",
    manage_employee_info: "Manage employee information",
    handle_company_invoices: "Handle company invoices",
    track_inventory_items: "Track inventory items",
    manage_warehouse_locations: "Manage warehouse locations",
    view_business_reports: "View business reports",
    permission_view_sales: "View Sales",
    permission_manage_sales: "Manage Sales",
    permission_view_reports: "View Reports",
    permission_view_invoices: "View Invoices",
    permission_view_cash_bank: "View Cash & Bank",
    permission_view_employees: "View Employees",
    permission_view_inventory: "View Inventory",
    permission_manage_invoices: "Manage Invoices",
    permission_view_hr_payroll: "View HR & Payroll",
    permission_view_purchasing: "View Purchasing",
    permission_view_warehouses: "View Warehouses",
    permission_manage_cash_bank: "Manage Cash & Bank",
    permission_manage_employees: "Manage Employees",
    permission_manage_inventory: "Manage Inventory",
    permission_manage_hr_payroll: "Manage HR & Payroll",
    permission_manage_purchasing: "Manage Purchasing",
    permission_manage_warehouses: "Manage Warehouses",
    permission_view_fixed_assets: "View Fixed Assets",
    permission_manage_fixed_assets: "Manage Fixed Assets",
    permission_view_general_ledger: "View General Ledger",
    permission_view_tax_management: "View Tax Management",
    permission_manage_general_ledger: "Manage General Ledger",
    permission_manage_tax_management: "Manage Tax Management",
    permission_view_accounts_payable: "View Accounts Payable",
    permission_view_financial_reports: "View Financial Reports",
    permission_view_roles_permissions: "View Roles & Permissions",
    permission_manage_accounts_payable: "Manage Accounts Payable",
    permission_manage_financial_reports: "Manage Financial Reports",
    permission_manage_roles_permissions: "Manage Roles & Permissions",
    permission_view_accounts_receivable: "View Accounts Receivable",
    permission_manage_accounts_receivable: "Manage Accounts Receivable",
    employees_management: "Employees Management",
    manage_employee_info_records: "Manage employee information and records",
    view_employee_info: "View employee information",
    add_employee: "Add Employee",
    search_employees: "Search employees...",
    loading_employees: "Loading employees...",
    no_employees_found_search: "No employees found matching your search.",
    no_employees_found: "No employees found.",
    employee_number: "Employee #",
    name: "Name",
    position: "Position",
    department: "Department",
    salary: "Salary",
    hire_date: "Hire Date",
    status: "Status",
    actions: "Actions",
    failed_save_employee: "Failed to save employee",
    error_save_employee: "An error occurred while saving the employee",
    invoices_management: "Invoices Management",
    manage_company_invoices_billing: "Manage company invoices and billing",
    view_company_invoices: "View company invoices",
    create_invoice: "Create Invoice",
    search_invoices: "Search invoices...",
    loading_invoices: "Loading invoices...",
    no_invoices_found_search: "No invoices found matching your search.",
    no_invoices_found: "No invoices found.",
    invoice_number: "Invoice #",
    client: "Client",
    amount: "Amount",
    invoice_status: "Status",
    issue_date: "Issue Date",
    due_date: "Due Date",
    pending: "Pending",
    paid: "Paid",
    overdue: "Overdue",
    failed_save_invoice: "Failed to save invoice",
    error_save_invoice: "An error occurred while saving the invoice",
    inventory_management_module_access: "You do not have access to Inventory Management module.",
    products: "Products",
    manage_inventory_products: "Manage inventory products",
    add_product: "Add Product",
    sku: "SKU",
    unit: "Unit",
    active: "Active",
    inactive: "Inactive",
    warehouses: "Warehouses",
    manage_inventory_warehouses: "Manage inventory warehouses",
    add_warehouse: "Add Warehouse",
    location: "Location",
    edit_product: "Edit Product",
    edit_warehouse: "Edit Warehouse",
    form_coming_soon: "Form coming soon",
    cancel: "Cancel",
    save: "Save",
    you_do_not_have_access_warehouses: "You do not have access to Warehouses Management module.",
    warehouses_management: "Warehouses Management",
    manage_warehouse_locations_inventory: "Manage warehouse locations and inventory",
    view_warehouse_info: "View warehouse information",
    search_warehouses: "Search warehouses...",
    loading_warehouses: "Loading warehouses...",
    no_warehouses_found_search: "No warehouses found matching your search.",
    no_warehouses_found: "No warehouses found.",
    warehouse_number: "Warehouse #",
    inventory: "Inventory",
    manage_inventory_items: "Manage inventory items",
    add_inventory_item: "Add Inventory Item",
    search_inventory: "Search inventory...",
    loading_inventory: "Loading inventory...",
    no_inventory_found_search: "No inventory found matching your search.",
    no_inventory_found: "No inventory found.",
    item_name: "Item Name",
    item_code: "Item Code",
    quantity: "Quantity",
    unit_price: "Unit Price",
    category: "Category",
    transfer_inventory: "Transfer Inventory",
    sale: "Sale",
    debt_sale: "Debt Sale",
    client_name: "Client Name",
    debtor_name: "Debtor Name",
    debtor_type: "Debtor Type",
    debtor_contact: "Debtor Contact",
    due_date: "Due Date",
    notes: "Notes",
    unknown_item: "Unknown Item",
    please_add_valid_item_sale: "Please add at least one valid item to the sale",
    please_add_valid_item_debt_sale: "Please add at least one valid item to the debt sale",
    failed_save_warehouse: "Failed to save warehouse",
    error_save_warehouse: "An error occurred while saving the warehouse",
    failed_add_inventory_item: "Failed to add inventory item",
    error_add_inventory_item: "An error occurred while adding the inventory item",
    failed_transfer_inventory: "Failed to transfer inventory",
    error_transfer_inventory: "An error occurred during the transfer",
    failed_complete_sale: "Failed to complete sale",
    error_complete_sale: "An error occurred during the sale",
    failed_complete_debt_sale: "Failed to complete debt sale",
    error_complete_debt_sale: "An error occurred during the debt sale",
    business_reports_analytics: "Business Reports & Analytics",
    overview_key_metrics: "Overview of key business metrics and performance indicators",
    total_employees: "Total Employees",
    total_revenue: "Total Revenue",
    total_invoices: "Total Invoices",
    inventory_items: "Inventory Items",
    warehouses_card: "Warehouses",
    active_employees: "Active employees in the company",
    total_revenue_paid_invoices: "Total revenue from paid invoices",
    pending_overdue: "{pending} pending, {overdue} overdue",
    items_low_stock: "{lowStockItems} items with low stock",
    active_warehouse_locations: "Active warehouse locations",
    overdue_invoices: "Overdue Invoices",
    invoices_overdue_attention: "{overdueInvoices} invoices are overdue and need attention",
    low_stock_alert: "Low Stock Alert",
    items_running_low_stock: "{lowStockItems} items are running low on stock",
    pending_invoices: "Pending Invoices",
    invoices_pending_payment: "{pendingInvoices} invoices are pending payment",
    alerts_notifications: "Alerts & Notifications",
    important_items_attention: "Important items that require attention",
    action_required: "Action Required",
    info: "Info",
    summary: "Summary",
    quick_overview_status: "Quick overview of current business status",
    loading_reports: "Loading reports...",
    total_debts: "Total Debts",
    active_debt: "Active Debt",
    overdue_debt: "Overdue Debt",
    paid_debt: "Paid Debt",
    written_off: "Written Off",
    debtor_contact: "Debtor Contact",
    total_amount: "Total Amount",
    remaining_amount: "Remaining Amount",
    record_payment: "Record Payment",
    payment_history: "Payment History",
    search_debts: "Search debts...",
    loading_debts: "Loading debts...",
    no_debts_found_search: "No debts found matching your search.",
    no_debts_found: "No debts found.",
    payment_amount: "Payment Amount",
    payment_date: "Payment Date",
    payment_method: "Payment Method",
    reference_number: "Reference Number",
    save_payment: "Save Payment",
    failed_record_payment: "Failed to record payment",
    error_record_payment: "An error occurred while recording the payment",
  },

  ar: {
    // Navigation & General
    dashboard: "لوحة التحكم",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    welcome: "مرحباً",
    loading: "جاري التحميل...",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    add: "إضافة",
    create: "إنشاء",
    update: "تحديث",
    search: "بحث",
    filter: "تصفية",
    export: "تصدير",
    import: "استيراد",
    settings: "الإعدادات",
    profile: "الملف الشخصي",
    help: "مساعدة",
    back: "رجوع",
    next: "التالي",
    previous: "السابق",
    close: "إغلاق",
    confirm: "تأكيد",
    view: "عرض",
    manage: "إدارة",
    new: "جديد",
    read: "مقروء",
    unread: "غير مقروء",
    mark: "تحديد",
    recent: "حديث",
    latest: "الأحدث",
    generating: "جاري الإنشاء",
    generate: "إنشاء",
    details: "التفاصيل",
    download: "تحميل",
    refresh: "تحديث",
    overview: "نظرة عامة",
    month: "شهر",
    months: "أشهر",

    // User Management
    users: "المستخدمون",
    employees: "الموظفون",
    companies: "الشركات",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    role: "الدور",
    permissions: "الصلاحيات",
    status: "الحالة",
    active: "نشط",
    inactive: "غير نشط",

    // Business Modules
    invoices: "الفواتير",
    inventory: "المخزون",
    warehouses: "المستودعات",
    reports: "التقارير",
    debts: "الديون",
    payments: "المدفوعات",
    sales: "المبيعات",
    purchases: "المشتريات",

    // AI & Forecasting
    ai_forecasting: "الذكاء الاصطناعي والتنبؤ",
    ai_insights: "رؤى الذكاء الاصطناعي",
    forecasting: "التنبؤ",
    predictions: "التوقعات",
    trends: "الاتجاهات",
    analysis: "التحليل",
    recommendations: "التوصيات",
    confidence: "الثقة",
    generate_report: "إنشاء تقرير",
    sales_forecast: "توقعات المبيعات",
    inventory_analysis: "تحليل المخزون",
    debt_analysis: "تحليل الديون",
    revenue_forecast: "توقعات الإيرادات",

    // Accounting Modules
    general_ledger: "دفتر الأستاذ العام",
    chart_of_accounts: "دليل الحسابات",
    journal_entries: "قيود اليومية",
    accounts_receivable: "الحسابات المدينة",
    accounts_payable: "الحسابات الدائنة",
    cash_bank: "النقدية والبنوك",
    fixed_assets: "الأصول الثابتة",
    hr_payroll: "الموارد البشرية والرواتب",
    tax_management: "إدارة الضرائب",
    financial_reports: "التقارير المالية",
    accounting_modules: "وحدات المحاسبة",
    accounting_modules_desc: "نظام محاسبي متكامل بجميع الوحدات الأساسية لإدارة الأعمال",
    features: "الميزات:",
    request_access: "طلب صلاحية",
    roles_permissions: "الأدوار والصلاحيات",
    roles_permissions_desc: "التحكم في وصول المستخدمين وسجل التدقيق",
    general_ledger_desc: "دليل حسابات هرمي، قيود اليومية، وحساب الأرصدة",
    accounts_receivable_desc: "فواتير العملاء، تتبع المدفوعات، وتقارير الأعمار",
    accounts_payable_desc: "إدارة فواتير الموردين وجدولة المدفوعات",
    inventory_management_desc: "إدارة المخزون والمستودعات بشكل كامل",
    purchasing_desc: "إدارة أوامر الشراء وعلاقات الموردين",
    sales_desc: "معالجة أوامر البيع وإدارة العملاء",
    hr_payroll_desc: "إدارة الموظفين ومعالجة الرواتب",
    cash_bank_desc: "إدارة التدفق النقدي والتسوية البنكية",
    fixed_assets_desc: "تتبع الأصول وإدارة الإهلاك",
    tax_management_desc: "حساب الضرائب وإدارة الالتزام الضريبي",
    financial_reports_desc: "تقارير مالية شاملة ولوحات معلومات",

    // Data & Analytics
    total: "الإجمالي",
    amount: "المبلغ",
    price: "السعر",
    date: "التاريخ",
    period: "الفترة",
    growth: "نمو",
    decline: "انخفاض",
    stable: "مستقر",
    high: "عالي",
    medium: "متوسط",
    low: "منخفض",
    critical: "حرج",

    // Messages & Alerts
    success: "نجح",
    error: "خطأ",
    warning: "تحذير",
    info: "معلومات",
    no_data: "لا توجد بيانات متاحة",
    data_updated: "تم تحديث البيانات بنجاح",
    operation_successful: "تمت العملية بنجاح",
    operation_failed: "فشلت العملية",

    // Time & Dates
    today: "اليوم",
    yesterday: "أمس",
    this_week: "هذا الأسبوع",
    this_month: "هذا الشهر",
    this_year: "هذا العام",
    last_month: "الشهر الماضي",
    last_year: "العام الماضي",

    // Actions
    analyze: "تحليل",
    forecast: "توقع",
    upload: "رفع",
    sync: "مزامنة",

    // AI Specific
    ai_analysis: "تحليل الذكاء الاصطناعي",
    machine_learning: "التعلم الآلي",
    predictive_analytics: "التحليلات التنبؤية",
    business_intelligence: "ذكاء الأعمال",
    data_insights: "رؤى البيانات",
    automated_reports: "التقارير الآلية",
    smart_recommendations: "التوصيات الذكية",
    trend_analysis: "تحليل الاتجاهات",
    anomaly_detection: "كشف الشذوذ",
    performance_metrics: "مقاييس الأداء",

    // Accounting Specific
    debit: "مدين",
    credit: "دائن",
    balance: "الرصيد",
    account: "حساب",
    transaction: "معاملة",
    customer: "عميل",
    supplier: "مورد",
    vendor: "بائع",
    asset: "أصل",
    liability: "التزام",
    equity: "حقوق الملكية",
    revenue: "إيراد",
    expense: "مصروف",
    profit_loss: "الأرباح والخسائر",
    balance_sheet: "الميزانية العمومية",
    cash_flow: "التدفق النقدي",
    trial_balance: "ميزان المراجعة",
    aging_report: "تقرير الأعمار",
    reconciliation: "التسوية",
    depreciation: "الإهلاك",
    tax: "ضريبة",
    vat: "ضريبة القيمة المضافة",
    payroll: "كشف الرواتب",
    salary: "راتب",
    allowance: "بدل",
    deduction: "خصم",

    // Journal Entries UI
    no_access: "ليس لديك صلاحية الوصول إلى هذه الوحدة.",
    add_entry: "إضافة قيد",
    edit_entry: "تعديل القيد",
    entries_list: "قائمة القيود",
    journal_entries_desc: "جميع قيود اليومية لشركتك. يجب أن يحتوي كل قيد على سطرين على الأقل (مدين/دائن).",
    lines: "الأسطر",
    description: "الوصف",
    delete_entry_confirm: "هل أنت متأكد أنك تريد حذف هذا القيد؟",
    no_access_ap: "ليس لديك صلاحية الوصول إلى وحدة الحسابات الدائنة.",
    purchase_invoices: "فواتير الشراء",
    manage_supplier_invoices: "إدارة فواتير الموردين",
    add_invoice: "إضافة فاتورة",
    invoice_number: "رقم الفاتورة",
    supplier: "المورد",
    total: "الإجمالي",
    actions: "الإجراءات",
    supplier_payments: "مدفوعات الموردين",
    manage_payments_to_suppliers: "إدارة المدفوعات للموردين",
    add_payment: "إضافة دفعة",
    amount: "المبلغ",
    invoice: "الفاتورة",
    method: "طريقة الدفع",
    edit_invoice: "تعديل الفاتورة",
    form_coming_soon: "النموذج قادم قريباً",
    edit_payment: "تعديل الدفعة",
    add_payment: "إضافة دفعة",
    full_access: "صلاحية كاملة",
    no_access: "بدون صلاحية",
    view_only: "عرض فقط",
    features_available: "{count} ميزة متاحة",
    access_summary: "ملخص الصلاحيات",
    account_information: "معلومات الحساب",
    account_details_permissions: "تفاصيل وصلاحيات حسابك",
    unique_key: "المفتاح الفريد",
    account_expires: "انتهاء الحساب",
    never: "دائمًا",
    your_permissions: "صلاحياتك {permissions}",
    what_you_can_access: "ما يمكنك الوصول إليه في النظام",
    no_permissions_assigned: "لا توجد صلاحيات مخصصة",
    contact_admin_request_access: "تواصل مع مسؤول الشركة لطلب الصلاحية",
    available: "متاح",
    access: "الوصول",
    debt_management: "إدارة الديون",
    track_manage_debts: "تتبع وإدارة الديون المستحقة",
    manage_employee_info: "إدارة معلومات الموظفين",
    handle_company_invoices: "إدارة فواتير الشركة",
    track_inventory_items: "تتبع عناصر المخزون",
    manage_warehouse_locations: "إدارة مواقع المستودعات",
    view_business_reports: "عرض تقارير الأعمال",
    permission_view_sales: "عرض المبيعات",
    permission_manage_sales: "إدارة المبيعات",
    permission_view_reports: "عرض التقارير",
    permission_view_invoices: "عرض الفواتير",
    permission_view_cash_bank: "عرض النقدية والبنوك",
    permission_view_employees: "عرض الموظفين",
    permission_view_inventory: "عرض المخزون",
    permission_manage_invoices: "إدارة الفواتير",
    permission_view_hr_payroll: "عرض الموارد البشرية والرواتب",
    permission_view_purchasing: "عرض المشتريات",
    permission_view_warehouses: "عرض المستودعات",
    permission_manage_cash_bank: "إدارة النقدية والبنوك",
    permission_manage_employees: "إدارة الموظفين",
    permission_manage_inventory: "إدارة المخزون",
    permission_manage_hr_payroll: "إدارة الموارد البشرية والرواتب",
    permission_manage_purchasing: "إدارة المشتريات",
    permission_manage_warehouses: "إدارة المستودعات",
    permission_view_fixed_assets: "عرض الأصول الثابتة",
    permission_manage_fixed_assets: "إدارة الأصول الثابتة",
    permission_view_general_ledger: "عرض دفتر الأستاذ العام",
    permission_view_tax_management: "عرض إدارة الضرائب",
    permission_manage_general_ledger: "إدارة دفتر الأستاذ العام",
    permission_manage_tax_management: "إدارة إدارة الضرائب",
    permission_view_accounts_payable: "عرض الحسابات الدائنة",
    permission_view_financial_reports: "عرض التقارير المالية",
    permission_view_roles_permissions: "عرض الأدوار والصلاحيات",
    permission_manage_accounts_payable: "إدارة الحسابات الدائنة",
    permission_manage_financial_reports: "إدارة التقارير المالية",
    permission_manage_roles_permissions: "إدارة الأدوار والصلاحيات",
    permission_view_accounts_receivable: "عرض الحسابات المدينة",
    permission_manage_accounts_receivable: "إدارة الحسابات المدينة",
    employees_management: "إدارة الموظفين",
    manage_employee_info_records: "إدارة معلومات وسجلات الموظفين",
    view_employee_info: "عرض معلومات الموظفين",
    add_employee: "إضافة موظف",
    search_employees: "بحث عن الموظفين...",
    loading_employees: "جاري تحميل الموظفين...",
    no_employees_found_search: "لا يوجد موظفون يطابقون بحثك.",
    no_employees_found: "لا يوجد موظفون.",
    employee_number: "رقم الموظف",
    name: "الاسم",
    position: "الوظيفة",
    department: "القسم",
    salary: "الراتب",
    hire_date: "تاريخ التعيين",
    status: "الحالة",
    actions: "الإجراءات",
    failed_save_employee: "فشل في حفظ الموظف",
    error_save_employee: "حدث خطأ أثناء حفظ الموظف",
    invoices_management: "إدارة الفواتير",
    manage_company_invoices_billing: "إدارة فواتير الشركة والفوترة",
    view_company_invoices: "عرض فواتير الشركة",
    create_invoice: "إنشاء فاتورة",
    search_invoices: "بحث عن الفواتير...",
    loading_invoices: "جاري تحميل الفواتير...",
    no_invoices_found_search: "لا توجد فواتير تطابق بحثك.",
    no_invoices_found: "لا توجد فواتير.",
    invoice_number: "رقم الفاتورة",
    client: "العميل",
    amount: "المبلغ",
    invoice_status: "الحالة",
    issue_date: "تاريخ الإصدار",
    due_date: "تاريخ الاستحقاق",
    pending: "قيد الانتظار",
    paid: "مدفوعة",
    overdue: "متأخرة",
    failed_save_invoice: "فشل في حفظ الفاتورة",
    error_save_invoice: "حدث خطأ أثناء حفظ الفاتورة",
    inventory_management_module_access: "ليس لديك صلاحية الوصول إلى وحدة إدارة المخزون.",
    products: "المنتجات",
    manage_inventory_products: "إدارة منتجات المخزون",
    add_product: "إضافة منتج",
    sku: "رمز المنتج (SKU)",
    unit: "الوحدة",
    active: "نشط",
    inactive: "غير نشط",
    warehouses: "المستودعات",
    manage_inventory_warehouses: "إدارة مستودعات المخزون",
    add_warehouse: "إضافة مستودع",
    location: "الموقع",
    edit_product: "تعديل المنتج",
    edit_warehouse: "تعديل المستودع",
    form_coming_soon: "النموذج قادم قريباً",
    cancel: "إلغاء",
    save: "حفظ",
    you_do_not_have_access_warehouses: "ليس لديك صلاحية الوصول إلى وحدة إدارة المستودعات.",
    warehouses_management: "إدارة المستودعات",
    manage_warehouse_locations_inventory: "إدارة مواقع المستودعات والمخزون",
    view_warehouse_info: "عرض معلومات المستودع",
    search_warehouses: "بحث عن المستودعات...",
    loading_warehouses: "جاري تحميل المستودعات...",
    no_warehouses_found_search: "لا توجد مستودعات تطابق بحثك.",
    no_warehouses_found: "لا توجد مستودعات.",
    warehouse_number: "رقم المستودع",
    inventory: "المخزون",
    manage_inventory_items: "إدارة عناصر المخزون",
    add_inventory_item: "إضافة عنصر مخزون",
    search_inventory: "بحث عن المخزون...",
    loading_inventory: "جاري تحميل المخزون...",
    no_inventory_found_search: "لا يوجد عناصر مخزون تطابق بحثك.",
    no_inventory_found: "لا يوجد عناصر مخزون.",
    item_name: "اسم العنصر",
    item_code: "كود العنصر",
    quantity: "الكمية",
    unit_price: "سعر الوحدة",
    category: "الفئة",
    transfer_inventory: "تحويل المخزون",
    sale: "بيع",
    debt_sale: "بيع آجل",
    client_name: "اسم العميل",
    debtor_name: "اسم المدين",
    debtor_type: "نوع المدين",
    debtor_contact: "بيانات التواصل مع المدين",
    due_date: "تاريخ الاستحقاق",
    notes: "ملاحظات",
    unknown_item: "عنصر غير معروف",
    please_add_valid_item_sale: "يرجى إضافة عنصر واحد صالح على الأقل للبيع",
    please_add_valid_item_debt_sale: "يرجى إضافة عنصر واحد صالح على الأقل للبيع الآجل",
    failed_save_warehouse: "فشل في حفظ المستودع",
    error_save_warehouse: "حدث خطأ أثناء حفظ المستودع",
    failed_add_inventory_item: "فشل في إضافة عنصر المخزون",
    error_add_inventory_item: "حدث خطأ أثناء إضافة عنصر المخزون",
    failed_transfer_inventory: "فشل في تحويل المخزون",
    error_transfer_inventory: "حدث خطأ أثناء التحويل",
    failed_complete_sale: "فشل في إتمام عملية البيع",
    error_complete_sale: "حدث خطأ أثناء البيع",
    failed_complete_debt_sale: "فشل في إتمام البيع الآجل",
    error_complete_debt_sale: "حدث خطأ أثناء البيع الآجل",
    business_reports_analytics: "تقارير الأعمال والتحليلات",
    overview_key_metrics: "نظرة عامة على مؤشرات الأداء الرئيسية",
    total_employees: "إجمالي الموظفين",
    total_revenue: "إجمالي الإيرادات",
    total_invoices: "إجمالي الفواتير",
    inventory_items: "عناصر المخزون",
    warehouses_card: "المستودعات",
    active_employees: "الموظفون النشطون في الشركة",
    total_revenue_paid_invoices: "إجمالي الإيرادات من الفواتير المدفوعة",
    pending_overdue: "{pending} قيد الانتظار، {overdue} متأخرة",
    items_low_stock: "{lowStockItems} عنصر منخفض المخزون",
    active_warehouse_locations: "مواقع المستودعات النشطة",
    overdue_invoices: "فواتير متأخرة",
    invoices_overdue_attention: "{overdueInvoices} فاتورة متأخرة وتحتاج إلى الانتباه",
    low_stock_alert: "تنبيه انخفاض المخزون",
    items_running_low_stock: "{lowStockItems} عنصر على وشك النفاد من المخزون",
    pending_invoices: "فواتير قيد الانتظار",
    invoices_pending_payment: "{pendingInvoices} فاتورة قيد الانتظار للدفع",
    alerts_notifications: "التنبيهات والإشعارات",
    important_items_attention: "عناصر هامة تتطلب الانتباه",
    action_required: "يتطلب إجراء",
    info: "معلومة",
    summary: "الملخص",
    quick_overview_status: "نظرة سريعة على حالة الأعمال الحالية",
    loading_reports: "جاري تحميل التقارير...",
    total_debts: "إجمالي الديون",
    active_debt: "دين نشط",
    overdue_debt: "دين متأخر",
    paid_debt: "دين مدفوع",
    written_off: "تم شطبه",
    debtor_contact: "بيانات التواصل مع المدين",
    total_amount: "إجمالي المبلغ",
    remaining_amount: "المبلغ المتبقي",
    record_payment: "تسجيل دفعة",
    payment_history: "سجل الدفعات",
    search_debts: "بحث عن الديون...",
    loading_debts: "جاري تحميل الديون...",
    no_debts_found_search: "لا توجد ديون تطابق بحثك.",
    no_debts_found: "لا توجد ديون.",
    payment_amount: "مبلغ الدفعة",
    payment_date: "تاريخ الدفعة",
    payment_method: "طريقة الدفع",
    reference_number: "رقم المرجع",
    save_payment: "حفظ الدفعة",
    failed_record_payment: "فشل في تسجيل الدفعة",
    error_record_payment: "حدث خطأ أثناء تسجيل الدفعة",
  },
}

export function getTranslation(key: keyof TranslationKeys, language: Language = "en"): string {
  return translations[language][key] || translations.en[key] || key
}

export function t(key: keyof TranslationKeys, language?: Language): string {
  return getTranslation(key, language)
}

export default translations
