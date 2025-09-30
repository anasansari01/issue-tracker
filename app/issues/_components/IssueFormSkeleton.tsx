import {Box} from '@radix-ui/themes'
import {Skeleton} from '@/app/components'
import React from 'react'

const IssueFormSkeleton = () => {
  return (
   <Box className='max-w-xl'>
    <Skeleton className='2rem'/>
    <Skeleton className='20rem'/>
   </Box>
  )
}

export default IssueFormSkeleton
