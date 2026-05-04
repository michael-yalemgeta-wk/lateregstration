import { notFound } from 'next/navigation';

export default function AdminDashboard() {
  // Return 404 to hide the fact that this path ever existed
  notFound();
}
