import type { Route } from './+types/kontak';
import { seo } from '@/lib/seo';
import { ContactForm } from '@/components/contact-form';
export function meta({matches,location}:Route.MetaArgs){return seo({matches,location},{title:'Kontak & Kolaborasi Brand | SNBM Creator',description:'Hubungi SNBM Creator untuk kerja sama fashion retail, host live shopping, operasional live commerce, atau pendaftaran host.'});}
export default function Contact(){return <ContactForm/>;}