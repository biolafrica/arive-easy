import {useTemplateDocument } from "@/hooks/useSpecialized/useDocuments";
import { PartnerDocumentData } from "@/type/pages/dashboard/documents";
import PartnerDocumentForm from "../common/PartnerForm";
import { useState } from "react";
import { DescriptionList } from "@/components/common/DescriptionList";
import { documentTypes } from "@/data/pages/dashboard/documents";


export default function PartnerDetail() {
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');

  const { template: masterTemplate, isLoading: loadingTemplate, error } = useTemplateDocument(selectedDocumentType);

  const createPartnerDocument= async (values:PartnerDocumentData)=>{
    console.log(values)

  }


  return (
    <div className="space-y-6">

      <div>
        <h3 className="text-lg font-semibold mb-4">Create Partner Document</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type *
            </label>

            <select
              value={selectedDocumentType}
              onChange={(e) => setSelectedDocumentType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select document type...</option>
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {selectedDocumentType && (
            <div className="p-3 bg-gray-50 rounded-lg">

              {loadingTemplate ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Loading template...</span>
                </div>

              ) : error || !masterTemplate ? (
                <div className="text-red-600 text-md font-semibold">
                  No active template found for this document type.
                </div>

              ) : (
                <DescriptionList
                  title={`${masterTemplate.type} Attachment`}
                  subtitle="View the default template Structure."
                  items={[
                    {
                      label: 'Attachments',
                      value: {
                        type: 'attachments',
                        files: [{ name : masterTemplate.name, url: masterTemplate.template_file_url || undefined}]
                      },
                    },
                  ]}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {selectedDocumentType && masterTemplate && (
        <PartnerDocumentForm
          template={masterTemplate}
          onSubmit={async (values) => {
            createPartnerDocument(values)
            
          }}
          submitLabel="Save My Template"
        />
      )}

      {!selectedDocumentType && (
        <div className="text-center py-8 text-gray-500">
          <p>Select a document type to begin customizing your template.</p>
        </div>
      )}
   
    </div>
  );
}