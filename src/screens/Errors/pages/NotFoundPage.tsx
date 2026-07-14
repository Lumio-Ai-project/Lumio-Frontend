import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes/paths';
import notFoundImage from '../../../../dist/assets/undraw_page-not-found_6wni.svg';

export function NotFoundPage() {
  return (
  <div className="flex flex-col items-center justify-center h-screen">
    <img src={notFoundImage} alt="Not Found" className="w-1/2 h-1/2 " />
    
    <Link to={ROUTES.HOME} className="mt-6">
      <Button>Go home</Button>
    </Link>
  </div>
  );
}
