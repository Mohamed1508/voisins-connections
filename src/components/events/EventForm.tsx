
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
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EventFormSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  date: z.string().min(1, {
    message: "Date is required.",
  }),
  time: z.string().min(1, {
    message: "Time is required.",
  }),
});

interface EventFormProps {
  onCancel: () => void;
  position: { lat: number; lng: number };
}

const EventForm = ({ onCancel, position }: EventFormProps) => {
  const { translations } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof EventFormSchema>>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      name: "",
      date: new Date().toISOString().split('T')[0],
      time: "12:00",
    },
  });

  const onSubmit = async (values: z.infer<typeof EventFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create an event.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.from("events").insert({
        name: values.name,
        date: values.date,
        time: values.time,
        created_by: user.id,
        lat: position.lat,
        lng: position.lng,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Event created successfully!",
      });
      onCancel();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-card rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="text-primary" size={24} />
        <h3 className="text-xl font-bold">{translations.createEvent || "Create Event"}</h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.eventName || "Event Name"}</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Community Meetup" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.date || "Date"}</FormLabel>
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
                <FormLabel>{translations.time || "Time"}</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <p className="text-xs text-muted-foreground">
            {translations.locationNote || "Click on the map to select a location"}
          </p>

          <div className="flex justify-between pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              {translations.cancel || "Cancel"}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {translations.createEvent || "Create Event"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventForm;
