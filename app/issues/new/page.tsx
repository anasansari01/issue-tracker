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

type IssueForm = z.infer<typeof CreateIssueSchema>;

const NewIssuePage = () => {
  const router = useRouter();
  const {register, control, handleSubmit, formState: {errors}} = useForm<IssueForm>({
    resolver: zodResolver(CreateIssueSchema)
  });
  const [Error, setError] = useState('');

  return (
    <div className='max-w-xl'>
      {Error && <Callout.Root color='red' className='mb-5'>
        <Callout.Text>
          {Error}
        </Callout.Text>
      </Callout.Root>}
      <form 
        className='space-y-3' 
        onSubmit={handleSubmit(async (data) => {
          try{
            await axios.post('/api/issues', data);
            router.push('/issues');
          }catch(err){
            setError('An Unexpected Error occur!');
          }
        })}>
        <TextField.Root  placeholder="Title" {...register('title')} >
          <TextField.Slot />
        </TextField.Root>
        {errors.title && <Text color='red' as='p'>{errors.title.message}</Text>}
        <Controller
          name="description"
          control={control}
          defaultValue=''
          render={({ field }) => <SimpleMDE placeholder='Description' {...field} />}
        />
        {errors.description && <Text color='red' as='p'>{errors.description.message}</Text>}
        <Button>Submit New Issue</Button>
      </form>
    </div>
  )
}

export default NewIssuePage