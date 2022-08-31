import React, {useRef, useState, useEffect} from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = props => {
    const filePickerRef = useRef();
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    const pickedHandler = event => {
        let pickedFile;
        let fileIsValid = isValid;
        if(event.target.files && event.target.files.length === 1){
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }

        props.onInput(props.id, pickedFile, fileIsValid);
    };

    useEffect(()=>{
        if(!file){
            return
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        }
        fileReader.readAsDataURL(file);
    },[file]);

    const pickImageHandler = () => {
        filePickerRef.current.click();
    }

    return (
        <div className='form-control'>
            <input 
                id={props.id} 
                style={{display : 'none'}} 
                ref={filePickerRef} 
                type="file" 
                accept=".jpg, .png, .jpeg" 
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload__preview'>
                    {previewUrl && <img src={previewUrl} alt='Preview'/>}
                    {!previewUrl && <p>Please select an image.</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>Upload Image</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;