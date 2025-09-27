'use client';

import { Button, TextField, Callout } from '@radix-ui/themes'
import SimpleMDE from "react-simplemde-editor";
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { error } from 'console';

interface IssueForm {
  title: string;
  description: string;
}

const NewIssuePage = () => {
  const router = useRouter();
  const {register, control, handleSubmit} = useForm<IssueForm>();
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
        <Controller
          name="description"
          control={control}
          render={({ field }) => <SimpleMDE placeholder='Description' {...field} />}
        />
        <Button>Submit New Issue</Button>
      </form>
    </div>
  )
}

export default NewIssuePage