'use client';

import { Button, TextField, Callout } from '@radix-ui/themes'
import { useForm, Controller } from 'react-hook-form';
import SimpleMDE from 'react-simplemde-editor';
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import { issueSchema } from '@/app/ValidationSchema';
import {z} from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import React from 'react'
import { Issue } from '@prisma/client';

type IssueForm = z.infer<typeof issueSchema>;

const IssueForm = ({issue}:{issue?: Issue}) => {
  const router = useRouter();
  const {register, control, handleSubmit, formState: {errors}} = useForm<IssueForm>({
    resolver: zodResolver(issueSchema)
  });
  const [Error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try{
      setSubmitting(true);
      if (issue) await axios.patch('/api/issues/' + issue.id, data)
        else await axios.post('/api/issues', data);
      router.push('/issues');
      router.refresh();
    }catch(err){
      setSubmitting(false);
      setError('An Unexpected Error occur!');
    }
  });

  return (
    <div className='max-w-xl'>
      {Error && <Callout.Root color='red' className='mb-5'>
        <Callout.Text>
          {Error}
        </Callout.Text>
      </Callout.Root>}
      <form 
        className='space-y-3' 
        onSubmit={onSubmit}>
       <TextField.Root defaultValue={issue?.title}
            placeholder="Title"
            {...register('title')}>
          <TextField.Slot/>
        </TextField.Root>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Controller
          name="description"
          control={control}
          defaultValue={issue?.description}
          render={({ field }) => <SimpleMDE placeholder='Description' {...field} />}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button disabled={isSubmitting}>{issue ? 'Update Issue' : 'Submit New Issue'}{isSubmitting && <Spinner/>}</Button>
      </form>
    </div>
  )
}

export default IssueForm
