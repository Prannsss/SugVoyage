
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const reportFormSchema = z.object({
  violation: z.string().min(1, 'Please select a violation type.'),
  explanation: z
    .string()
    .min(10, 'Please provide a more detailed explanation.')
    .max(500, 'Explanation cannot exceed 500 characters.'),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

export default function ReportUserPage() {
  const params = useParams();
  const username = params.username as string;
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      violation: '',
      explanation: '',
    },
  });

  function onSubmit(data: ReportFormValues) {
    console.log('Submitting report:', {
      user: username,
      ...data,
    });
    toast({
      title: 'Report Submitted',
      description: `Thank you for reporting ${username}. We will review it shortly.`,
    });
    router.push(`/profile/${username}`);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 px-4 md:px-6 pt-24 md:pt-12">
      <header className="relative flex items-center justify-center">
        <Link href={`/profile/${username}`} className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Back to profile</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold tracking-tight font-headline">Report User</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Report @{username}</CardTitle>
          <CardDescription>
            Help us understand the problem. What is going on with this user?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="violation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Violation Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Spam, Harassment, Impersonation" {...field} />
                    </FormControl>
                    <FormDescription>
                      What kind of rule is this user breaking?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="explanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Explanation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`Please provide specific details about why you are reporting @${username}.`}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>
                      Any additional information will help our review.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit Report</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
