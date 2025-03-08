
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Header from "@/components/layout/Header";

const Confirmation = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/30">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Compte confirmé !</CardTitle>
            <CardDescription>
              Votre adresse email a été vérifiée avec succès.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Vous pouvez maintenant vous connecter et profiter de toutes les fonctionnalités de Voisins Proches.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button asChild className="w-full">
              <Link to="/login">Se connecter</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Confirmation;
