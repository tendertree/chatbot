"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { queryDocument } from '@/action/OpenAIAction';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

// 폼 스키마 정의
const formSchema = z.object({
    question: z.string().min(1, {
        message: "Question must be at least 1 character.",
    }),
});

export default function OpenAIForm() {
    const [answer, setAnswer] = useState<string | undefined>(undefined);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: "",
        },
    });

    // 제출 핸들러
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const result = await queryDocument(values.question);
        if (result.success) {
            setAnswer(result.answer);
        } else {
            setAnswer('Failed to get answer');
        }
    }

    return (
        <div className="space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="question"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Question</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ask a question" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter your question about the document.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Ask</Button>
                </form>
                {answer !== undefined && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Answer:</h3>
                        <p>{answer}</p>
                    </div>
                )}
            </Form>


            {answer !== undefined && (
                <Card>
                    <CardHeader>
                        <CardTitle>Answer</CardTitle>
                        <CardDescription> what we found based on your question</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>{answer}</p>
                    </CardContent>
                </Card>
            )}
        </div>




    );
}
