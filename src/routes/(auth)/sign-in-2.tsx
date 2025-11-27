import { createFileRoute } from '@tanstack/react-router'
import { SignIn2 } from '@/features/auth/sign-in/sign-in-2'
import { z } from 'zod'

const signInSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in-2')({
  validateSearch: signInSearchSchema,
  component: SignIn2,
})
