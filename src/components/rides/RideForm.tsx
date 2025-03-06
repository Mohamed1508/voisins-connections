
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RideFormSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  departure: z.string().min(2, {
    message: "Departure point is required.",
  }),
  arrival: z.string().min(2, {
    message: "Arrival point is required.",
  }),
  date: z.string().min(1, {
    message: "Date is required.",
  }),
  time: z.string().min(1, {
    message: "Time is required.",
  }),
  availableSeats: z.string().transform((val) => parseInt(val, 10)),
});

interface RideFormProps {
  onCancel: () => void;
  position: { lat: number; lng: number };
}

const RideForm = ({ onCancel, position }: RideFormProps) => {
  const { translations } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof RideFormSchema>>({
    resolver: zodResolver(RideFormSchema),
    defaultValues: {
      name: "",
      departure: "",
      arrival: "",
      date: new Date().toISOString().split('T')[0],
      time: "12:00",
      availableSeats: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof RideFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a ride.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.from("rides").insert({
        name: values.name,
        departure: values.departure,
        arrival: values.arrival,
        date: values.date,
        time: values.time,
        available_seats: values.availableSeats,
        created_by: user.id,
        lat: position.lat,
        lng: position.lng,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Ride created successfully!",
      });
      onCancel();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create ride",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-card rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Car className="text-primary" size={24} />
        <h3 className="text-xl font-bold">{translations.createRide}</h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.carpooling}</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Morning commute to work" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="departure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.departure}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Saint-Denis" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="arrival"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.arrival}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Paris Center" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.date}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.time}</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availableSeats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.availableSeats}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select available seats" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              {translations.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {translations.createRide}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RideForm;
