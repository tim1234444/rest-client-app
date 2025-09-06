
import { object, string } from 'yup';

  
export const  schema = object({
    method: string()
      .required('Method is required'),

    url: string()
    .required('Url is required'),

   
  });
