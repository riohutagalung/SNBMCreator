import type { Route } from './+types/kontak';
import { seo } from '@/lib/seo';
import { heroImage } from '@/data/content';
import { ContactForm } from '@/components/contact-form';
export function meta({matches,location}:Route.MetaArgs){return seo({matches,location},{title:'Kontak & Pendaftaran Host — SNBM Creator',description:'Hubungi SNBM Creator untuk kolaborasi brand atau daftar menjadi host reguler 55–65 kg dan big size 75–100 kg, hijab maupun nonhijab di Indonesia.',image:heroImage});}
export default function Contact(){return <ContactForm/>;}
