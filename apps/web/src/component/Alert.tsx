import React from 'react';
import { Alert } from 'react-bootstrap';
import { useAlert } from '../providers/AlertProvider';

export default function AlertComponent() {
  const { alert, removeAlert } = useAlert();

  return (
    <>
        {alert && 
          <div className='position-fixed pt-2 px-2 w-100'>
            <Alert
              variant={alert.type}
              onClose={() => removeAlert()}
              dismissible
              >
              {alert.message}
              </Alert>
          </div>
        }
    </>

  );
}