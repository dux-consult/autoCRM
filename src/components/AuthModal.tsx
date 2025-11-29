import React, { useState } from 'react';
import { Dialog, DialogContent, Input, Button, Alert } from '../../components/ui';
import { Lock, AlertCircle, Mail, X, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
    const { t } = useLanguage();
    const [isLogin, setIsLogin] = useState(initialView === 'login');

    React.useEffect(() => {
        if (isOpen) {
            setIsLogin(initialView === 'login');
            setError('');
            setSuccessMessage('');
        }
    }, [isOpen, initialView]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onClose();
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            phone: phone
                        }
                    }
                });
                if (error) throw error;
                setSuccessMessage(t('registerSuccess'));
                // Optional: Switch to login or close modal
            }
        } catch (err: any) {
            setError(err.message || t('genericError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md mx-auto">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col space-y-6">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isLogin ? t('welcomeBack') : t('createAccount')}
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                            {isLogin
                                ? t('loginDesc')
                                : t('registerDesc')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive" className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </Alert>
                        )}
                        {successMessage && (
                            <Alert variant="default" className="flex items-center gap-2 bg-green-50 text-green-700 border-green-200">
                                <AlertCircle className="w-4 h-4" />
                                {successMessage}
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{t('emailLabel')}</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-9"
                                    required
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">{t('phoneLabel')}</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="tel"
                                        placeholder="0812345678"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{t('password')}</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-9"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-4 h-11 text-base" disabled={isLoading}>
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    {isLogin ? t('loggingIn') : t('registering')}
                                </div>
                            ) : (
                                isLogin ? t('login') : t('register')
                            )}
                        </Button>

                        <div className="text-center text-sm pt-2">
                            <span className="text-gray-500">
                                {isLogin ? t('noAccount') : t('hasAccount')}
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                    setSuccessMessage('');
                                }}
                                className="text-primary font-medium hover:underline focus:outline-none"
                            >
                                {isLogin ? t('register') : t('login')}
                            </button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
