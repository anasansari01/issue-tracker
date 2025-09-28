'use client';

import { Button, TextField, Callout, Text } from '@radix-ui/themes'
import SimpleMDE from "react-simplemde-editor";
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import { CreateIssueSchema } from '@/app/ValidationSchema';
import {z} from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';

type IssueForm = z.infer<typeof CreateIssueSchema>;

const NewIssuePage = () => {
  const router = useRouter();
  const {register, control, handleSubmit, formState: {errors}} = useForm<IssueForm>({
    resolver: zodResolver(CreateIssueSchema)
  });
  const [Error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try{
      setSubmitting(true);
      await axios.post('/api/issues', data);
      router.push('/issues');
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
        <TextField.Root  placeholder="Title" {...register('title')} >
          <TextField.Slot />
        </TextField.Root>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Controller
          name="description"
          control={control}
          defaultValue=''
          render={({ field }) => <SimpleMDE placeholder='Description' {...field} />}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button disabled={isSubmitting}>Submit New Issue {isSubmitting && <Spinner/>}</Button>
      </form>
    </div>
  )
}

export default NewIssuePage