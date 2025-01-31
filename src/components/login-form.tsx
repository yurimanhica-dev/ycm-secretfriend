"use client";

import { LoginState, login } from "@/app/(auth)/login/actions";
import { AlertCircle, CheckCircle, Gift, Loader } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

export default function LoginForm() {
  const [state, fromAction, pending] = useActionState<LoginState, FormData>(
    login,
    {
      success: null,
      message: "",
    }
  );

  return (
    <Card className="mx-auto max-w-sm px-4">
      <CardHeader>
        <CardTitle className="text-2xl flex flex-col items-center justify-center gap-2 text-center mb-2">
          <Gift className="h-12 w-12 text-primary" />
          <span className="font-bold">Secret Friend</span>
        </CardTitle>
        <CardDescription>
          Digite seu email para receber o link início de sessão.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={fromAction}>
          <div className="flex flex-col space-y-2 mb-2">
            <Label htmlFor="email">Email:</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Digite o seu email"
              required
            ></Input>
          </div>
          {state.success == true && (
            <Alert className="mb-4 text-muted-foreground">
              <div className="flex">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <div>
                  <AlertTitle>Email enviado com sucesso!</AlertTitle>
                  <AlertDescription>
                    Confira o seu inbox para acessar o link do inicio de sessão.
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          {state.success == false && (
            <Alert className="text-muted-foreground mb-4">
              <div className="flex">
                <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                <div>
                  <AlertTitle>Erro ao enviar o email!</AlertTitle>
                  <AlertDescription>
                    Ocorreu um erro ao enviar o link de login. Por favor, entre
                    em contato com o Administrador do Sistema!
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          <Button type="submit" className="w-full">
            {pending && <Loader className="animate-spin" />}
            Login
          </Button>
        </form>
        <div className="mt-4 space-y-1.5 text-sm text-gray-500">
          <div className="text-center hover:text-primary">
            <Link href="/login">Esqueceu a senha?</Link>
          </div>
          <Separator />
          <div className="text-center hover:text-primary">
            <Link href="/login">Criar uma conta</Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
