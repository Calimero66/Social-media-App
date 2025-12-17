import { useState } from 'react'
import { Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SearchBar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative flex items-center justify-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: '300px', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 z-10"
                    >
                        <div className="relative w-full">
                            <Input
                                type="search"
                                placeholder="Not working ..."
                                className="w-full pr-10 bg-background"
                                autoFocus
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute right-0 top-0"
                                onClick={() => setIsOpen(false)}
                            >
                                <Search className="h-4 w-4" />
                                <span className="sr-only">Close search</span>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsOpen(true)}
                >
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Open search</span>
                </Button>
            )}
        </div>
    )
}