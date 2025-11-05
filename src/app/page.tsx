/*
|-----------------------------------------
| Root Page - Redirects to Crypto App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: webapp, August, 2025
|-----------------------------------------
*/

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/crypto');
}
