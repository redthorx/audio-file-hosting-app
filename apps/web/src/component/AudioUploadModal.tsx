import { FormEvent, useEffect, useState } from "react";
import { Modal, Button,Form } from "react-bootstrap";
import { getCategories, uploadAudio} from "../utils/webFetch";
import { useAlert } from "../providers/AlertProvider";
import { useModal } from "../providers/ModalProvider";

interface AudioUploadModalProps {
  fetchAudio: () => void;
}
interface uploadAudioError{
  type: "name"|"category"|"file"| "general";
  message:string;
}
interface Categories{
    id:number;
    name:string
}

export default function AudioUploadModal({fetchAudio}:AudioUploadModalProps) {
  const [loading, setLoading] = useState(false);
  const [audioName,setAudioName] = useState('')
  const [availableCategories, setAvailableCategories] = useState<Categories[]|null>(null)
  const [audioCategory, setAudioCategory] = useState('')
  const [file,setFile] = useState<File|null>(null)
  const [fileKey, setFileKey] = useState(Date.now());
  const [uploadSuccess,setUploadSuccess] = useState(false);
  const [error,setError] = useState< uploadAudioError| null>(null)

  const MAX_UPLOAD_SIZE = Number(import.meta.env.VITE_MAX_UPLOAD_SIZE)
  const fetchCategories = async ()=>{
    const {error, categories} = await getCategories()
    if(error){
        if(error == 401) setError({type:'general',message:'You are unauthorized'})
        if(error===404) setError({type:'general',message:'No categories found'})
        setError({type:'general',message:'Internal Server error'})
    }
    if(categories){
        setAvailableCategories(categories)  
    }
    
  }
  useEffect(()=>{
    setLoading(true);
    fetchCategories();
    if(!error){
        setLoading(false)
    }
  },[])

  const handleUploadFile = async (e:FormEvent)=>{
    e.preventDefault();
    setUploadSuccess(false);
    setLoading(true);
    if(!file){
        setError({type:'file',message:'please select a file'})
        return;
    }
    if(file.size>MAX_UPLOAD_SIZE){
        setError({ type: 'file', message: 'File exceeds maximum upload size' });
        setFile(null);
        return;
    }
    //initial value
    if(audioCategory===''){
        setError({ type: 'category', message: 'Please select a category' });
        return;
    }
    const {success,error} = await uploadAudio(audioName,audioCategory,file)
        if(success){
          setUploadSuccess(true);
          fetchAudio();
          setAudioCategory('');
          setAudioName('');
          setFile(null);
          setFileKey(Date.now());
          setLoading(false);
        }
        else{

          if(error===401){
            setError({type:'general',message:'Unauthorized'})
          }
          else{
            setError({type:'general',message:'There was an issue uploading the file'})
          }
        } 
}

  return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Upload File</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        uploadSuccess &&(
                            <p className="text-success">Uploaded successfully!</p>
                        )
                    }
                    <Form onSubmit={handleUploadFile}>
                        {error && error.type === 'general' &&(
                            <Form.Text className='text-danger'>{error.message}</Form.Text>
                            )}
                        <Form.Group className="mb-3" controlId="audioName">
                            <Form.Label>Name of the Audio file</Form.Label>
                            <Form.Control 
                                type="string" 
                                placeholder="Enter audio name (Optional)" 
                                value={audioName}
                                onChange={(e) => setAudioName(e.target.value)}
                                disabled={loading}
                            />
                            {error && error.type === 'name' &&(
                                <Form.Text className='text-danger'>{error.message}</Form.Text>
                            )}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="audioCategory">
                            <Form.Label>Audio Category</Form.Label>
                            <Form.Select 
                                disabled={loading}
                                value={audioCategory}
                                onChange={(e)=>setAudioCategory(e.target.value)}
                                >
                                <option value="" disabled>Select category</option>
                                {
                                    availableCategories ? 
                                    availableCategories.map(((category)=>
                                        <option key={category.id} value={category.name}>{category.name}</option>
                                    ))
                                    :
                                    <></>
                                }
                            </Form.Select>
                            {error && error.type === 'category' &&(
                                <Form.Text className='text-danger'>{error.message}</Form.Text>
                            )}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="file">
                            <Form.Label>Select Audio File (mp3)</Form.Label>
                            <Form.Control 
                                type="file"
                                key={fileKey}
                                accept="audio/mpeg"
                                disabled={loading}
                                onChange={(e:React.FormEvent)=>{
                                    const selectedFiles = (e.target as HTMLInputElement).files
                                    if(selectedFiles && selectedFiles.length>0){
                                        setFile(selectedFiles[0])
                                    }
                                }
                                }
                            />
                            {error && error.type === 'file' &&(
                                <Form.Text className='text-danger'>{error.message}</Form.Text>
                            )}
                            </Form.Group>
                        <Button variant="primary" disabled={loading} type="submit" className="w-100">
                        Upload
                        </Button>
                    </Form>
                </Modal.Body>

            </>
  );
}