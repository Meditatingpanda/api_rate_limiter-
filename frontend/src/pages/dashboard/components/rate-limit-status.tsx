import { TIME_INTERVAL_IN_SECONDS } from '@/constants/time.constant'
import smsApiServices from '@/services/smsService'
import { useEffect, useState } from 'react'

interface RateLimitStatus {
  id: number
  phoneNumber: string
  ipAddress: string
  violationType: string
  createdAt: string
}

export function RateLimitStatus({ refresh }: { refresh: number }) {
  const [rateLimits, setRateLimits] = useState<RateLimitStatus[]>([])

  useEffect(() => {
    
    smsApiServices
      .getRateLimitStatus(TIME_INTERVAL_IN_SECONDS.TWO_DAYS)
      .then((data) => {
        setRateLimits(data?.rateLimitViolations)
      })
  }, [refresh])

  console.log(rateLimits)

  return (
    <div className='max-h-[400px] space-y-8 overflow-y-auto'>
      {rateLimits?.map((rateLimit) => (
        <RateLimitStatusCard key={rateLimit.id} rateLimits={rateLimit} />
      ))}
    </div>
  )
}

const RateLimitStatusCard = ({
  rateLimits,
}: {
  rateLimits: RateLimitStatus
}) => {
  return (
    <div className='rounded-lg bg-white p-4 shadow-md dark:bg-gray-800'>
      <div className='mb-2 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          {rateLimits.phoneNumber}
        </h3>
        <span className='rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200'>
          {rateLimits.violationType}
        </span>
      </div>
      <div className='space-y-2'>
        <p className='text-sm text-gray-600 dark:text-gray-300'>
          <span className='font-medium'>IP Address:</span>{' '}
          {rateLimits.ipAddress}
        </p>
        <p className='text-sm text-gray-600 dark:text-gray-300'>
          <span className='font-medium'>Created At:</span>{' '}
          {new Date(rateLimits.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  )
}
