'use client'

import DataTable from "@/components/common/DataTable";
import { columns, data, statusConfig } from "@/data/pages/dashboard/home";
import { useState } from "react";

export default function UserDashboardApplication (){
  const [searchValue, setSearchValue] = useState('');

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
    <div className="md:border rounded-lg md:bg-white p-1 md:p-10">
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
        
        onEdit={(item) => console.log('More action', item)}
        onDelete={(item) => console.log('More action', item)}
        onMore={(item) => console.log('More action', item)}
    
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        emptyMessage={{
          title: "No application found",
          message: "Your application will appear here"
        }}
      />

    </div>
  )
}