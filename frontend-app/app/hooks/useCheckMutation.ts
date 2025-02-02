import { useMutation } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system';

interface CheckParams {
    photoUri: string;
    age: string;
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
    q6: string;
    q7: string;
    q8: string;
}

async function uploadCheck(params: CheckParams) {
    const formData = new FormData();
    
    // Read the file and create a blob
    const fileInfo = await FileSystem.getInfoAsync(params.photoUri);
    if (!fileInfo.exists) {
        throw new Error('File does not exist');
    }

    // Append the image file
    formData.append('file', {
        uri: params.photoUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
    } as any);

    // Append other form fields
    formData.append('age', params.age);
    formData.append('q1', params.q1);
    formData.append('q2', params.q2);
    formData.append('q3', params.q3);
    formData.append('q4', params.q4);
    formData.append('q5', params.q5);
    formData.append('q6', params.q6);
    formData.append('q7', params.q7);
    formData.append('q8', params.q8);
    
    const response = await fetch('http://195.242.13.74:8090/check', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        },
    });

    if (!response.ok) {
        console.error('Network response was not ok:', response);
        throw new Error('Network response was not ok');
    }

    return response.json();
}

export function useCheckMutation() {
    return useMutation({
        mutationFn: uploadCheck,
    });
} 