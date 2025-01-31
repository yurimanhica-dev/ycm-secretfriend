"use client";

import { FacebookIcon, GithubIcon, Mail } from "lucide-react";
import Link from "next/link";
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

export default function RegisterForm() {
  return (
    <div className="max-w-sm px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Cadastro</CardTitle>
          <CardDescription>
            <div className="flex items-center text-center justify-center">
              Bem-vindo ao Amigo Secreto!!
            </div>
            Faça o seu cadastro, seus amigos o esperam.
          </CardDescription>
        </CardHeader>
        <div className="flex items-center justify-center gap-3 ">
          <div className="cursor-pointer">
            <Link href="https://www.facebook.com/">
              <FacebookIcon className="rounded-full border-2 border-white text-white h-8 w-8 p-1" />
            </Link>
          </div>
          <div>
            <Link href="/login">
              <GithubIcon className="rounded-full border-2 border-white text-white h-8 w-8 p-1" />
            </Link>
          </div>
          <div>
            <Link href="/login">
              <Mail className="rounded-full border-2 border-white text-white h-8 w-8 p-1" />
            </Link>
          </div>
        </div>
        <CardContent>
          <div>
            <form action="" className="space-y-3">
              <div className="space-y-1.5">
                <Label>Nome:</Label>
                <Input type="text" placeholder="Nome" />
              </div>
              <div className="space-y-1.5">
                <Label>Email:</Label>
                <Input type="email" name="email" placeholder="email" required />
              </div>
              <div className="space-y-1.5">
                <Label>Senha:</Label>
                <Input type="password" placeholder="password" required />
              </div>
              <div className="space-y-1.5">
                <Label>Confirmar Senha:</Label>
                <Input
                  type="password"
                  placeholder="confirm-password"
                  required
                />
              </div>
            </form>
            <Button className="w-full mt-6">Cadastrar</Button>
          </div>
          <div className="text-sm text-gray-500 text-center mt-4">
            Já possui uma conta? <a href="/login">Login</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
