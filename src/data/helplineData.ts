export interface StateHelpline {
  state: string;
  helpline: string;
  label: string;
}

export const STATE_HELPLINES: Record<string, StateHelpline> = {
  "Assam": { state: "Assam", helpline: "1070", label: "Assam SDMA" },
  "Bihar": { state: "Bihar", helpline: "0612-2294204", label: "Bihar Disaster Mgmt" },
  "Uttar Pradesh": { state: "Uttar Pradesh", helpline: "1070", label: "UP Relief Comm." },
  "West Bengal": { state: "West Bengal", helpline: "1070", label: "WB Disaster Mgmt" },
  "Odisha": { state: "Odisha", helpline: "0674-2534177", label: "OSDMA" },
  "Kerala": { state: "Kerala", helpline: "1077", label: "Kerala SDMA" },
  "Maharashtra": { state: "Maharashtra", helpline: "022-22694725", label: "Maharashtra Disaster" },
  "Gujarat": { state: "Gujarat", helpline: "079-23251900", label: "GSDMA" },
  "Rajasthan": { state: "Rajasthan", helpline: "0141-2227460", label: "Rajasthan Disaster" },
  "Madhya Pradesh": { state: "Madhya Pradesh", helpline: "0755-2441685", label: "MP Disaster" },
  "Tamil Nadu": { state: "Tamil Nadu", helpline: "1070", label: "TN Disaster Mgmt" },
  "Karnataka": { state: "Karnataka", helpline: "1070", label: "KSDMA" },
  "Andhra Pradesh": { state: "Andhra Pradesh", helpline: "0863-2340700", label: "AP SDMA" },
  "Telangana": { state: "Telangana", helpline: "040-23450549", label: "Telangana SDMA" },
  "Jharkhand": { state: "Jharkhand", helpline: "0651-2490059", label: "Jharkhand Disaster" },
  "Chhattisgarh": { state: "Chhattisgarh", helpline: "0771-2221870", label: "CG Disaster Mgmt" },
  "Punjab": { state: "Punjab", helpline: "0172-2749431", label: "Punjab Revenue" },
  "Haryana": { state: "Haryana", helpline: "1070", label: "Haryana Disaster" },
  "Uttarakhand": { state: "Uttarakhand", helpline: "0135-2710334", label: "USDMA" },
  "Himachal Pradesh": { state: "Himachal Pradesh", helpline: "0177-2880333", label: "HP Disaster Mgmt" },
  "Meghalaya": { state: "Meghalaya", helpline: "0364-2224407", label: "Meghalaya SDMA" },
  "Manipur": { state: "Manipur", helpline: "0385-2451220", label: "Manipur SDMA" },
  "Tripura": { state: "Tripura", helpline: "0381-2325997", label: "Tripura Disaster" },
  "Nagaland": { state: "Nagaland", helpline: "0370-2222580", label: "Nagaland SDMA" },
  "Mizoram": { state: "Mizoram", helpline: "0389-2322671", label: "Mizoram SDMA" },
  "Arunachal Pradesh": { state: "Arunachal Pradesh", helpline: "0360-2212054", label: "Arunachal SDMA" },
  "Sikkim": { state: "Sikkim", helpline: "03592-202539", label: "Sikkim SDMA" },
  "Goa": { state: "Goa", helpline: "0832-2225728", label: "Goa Disaster Mgmt" },
  "Delhi": { state: "Delhi", helpline: "011-22421528", label: "Delhi Disaster Mgmt" },
};

export const NATIONAL_HELPLINE = { helpline: "1078", label: "National Disaster (NDMA)" };

export function getHelplineForState(adminRegion: string | undefined): StateHelpline | typeof NATIONAL_HELPLINE {
  if (!adminRegion) return NATIONAL_HELPLINE;
  for (const [key, value] of Object.entries(STATE_HELPLINES)) {
    if (adminRegion.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return NATIONAL_HELPLINE;
}
