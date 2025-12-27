'use client'

import DataTable from "@/components/common/DataTable";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import ApplicationDetails from "@/components/sections/dashboard/application/ApplicationDetail";
import SidePanel from "@/components/ui/SidePanel";
import { columns, data, statusConfig } from "@/data/pages/dashboard/home";
import { useSidePanel } from "@/hooks/useSidePanel";
import { useState } from "react";

export default function UserDashboardApplication (){
  const [searchValue, setSearchValue] = useState('');

  const sidePanel = useSidePanel<any>();

  const handleFilter = () => {
    console.log('Opening filter...');
  };

  const handlePageChange= ()=>{
    console.log("page change")
  };

  const handleItemsPerPageChange= ()=>{
    console.log("page item change")
  };

  const pagination = {
    page: 1,
    limit: 10,
    total: 15,
    totalPages: 2,
  }

  return(
    <>
      <SidePanel
        isOpen={sidePanel.isOpen}
        onClose={sidePanel.close}
        title={sidePanel.mode = "edit"}
      >
        <ApplicationDetails/>
      
      </SidePanel>
   
      <PageContainer>
        <DataTable
          title="All Applications"
          columns={columns}
          data={data}
          pagination={pagination}

          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search users..."
          
          showFilter={true}
          onFilter={handleFilter}
          
          statusConfig={statusConfig}
          getStatus={(row) => row.status}
          
  
          onMore={sidePanel.openEdit}
      
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          emptyMessage={{
            title: "No application found",
            message: "Your application will appear here"
          }}
        />
      </PageContainer>

    </>
  )
}