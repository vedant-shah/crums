import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const Loader = ({ className }) => {
    return (
        <Loader2
            className={cn(' mx-2 text-primary-foreground animate-spin', className)}
        />
    );
};

export default Loader;