'use client'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllCustomers } from '@/app/redux/viewAllCustomerSlice'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/viewAllCustomer-constant'

const ViewAllCustomer = () => {
  const dispatch = useDispatch()
  const {loading, data } = useSelector((state) => state.viewAllCustomer ?? {})

  useEffect(() => {
    dispatch(fetchAllCustomers())
  }, [dispatch])

  return (
    <div className="p-4 mt-5 mb-6">
      <div className='flex'>
        <div className='w-full text-center'>
          
        </div>
      </div>
      <Table columns={Columns} data={data} loading={loading} title={"All Customers"} />
    </div>
  )
}

export default ViewAllCustomer