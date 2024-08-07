'use client'

import { useState } from 'react';
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import axios from 'axios';

const TarotCard = () => {
    const [cardImage, setCardImage] = useState<string | null>(null);

    const fetchTarotCard = async () => {
        const response = await axios.post(
            'https://api.openai.com/v1/images/generations',
            {
                model: "dall-e-3",
                prompt: "A detailed tarot card image",
                n: 1,
                size: "1024x1024"
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.data[0].url;
    };

    const { refetch, isLoading } = useQuery('tarotCard', fetchTarotCard, {
        enabled: false,
        onSuccess: (data) => {
            setCardImage(data);
        },
    });

    const handleButtonClick = () => {
        refetch();
    };

    return (
        <div>
            <button onClick={handleButtonClick} disabled={isLoading}>
                {isLoading ? '카드 생성 중...' : '타로 카드 뽑기'}
            </button>
            {cardImage && <img src={cardImage} alt="Tarot Card" />}
        </div>
    );
};

export default TarotCard;
