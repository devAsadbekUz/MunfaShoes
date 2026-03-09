import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Upload, ImageIcon } from 'lucide-react';

export function HeroManager() {
    const [currentHeroUrl, setCurrentHeroUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('site_settings')
            .select('hero_image_url')
            .eq('id', 1)
            .single();

        if (!error && data) {
            setCurrentHeroUrl(data.hero_image_url || '');
        }
        setLoading(false);
    };

    const handleUpdateHero = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            alert("Iltimos, yangi rasmni tanlang.");
            return;
        }

        setIsSubmitting(true);
        let imageUrl = '';

        // 1. Upload new image
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `hero_${Math.random()}.${fileExt}`;
        const filePath = `settings/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('munfa-media')
            .upload(filePath, imageFile);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            alert('Rasm yuklashda xatolik yuz berdi.');
            setIsSubmitting(false);
            return;
        }

        const { data: publicUrlData } = supabase.storage
            .from('munfa-media')
            .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;

        // 2. Update Database Record
        const { error: updateError } = await supabase
            .from('site_settings')
            .update({ hero_image_url: imageUrl })
            .eq('id', 1);

        if (updateError) {
            console.error('Error updating settings:', updateError);
            alert("Sozlamalarni yangilashda xatolik yuz berdi.");
        } else {
            setImageFile(null);
            fetchSettings(); // Refresh the current image display
            alert("Bosh sahifa rasmi muvaffaqiyatli o'zgartirildi!");
        }

        setIsSubmitting(false);
    };

    return (
        <div className="space-y-8">
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <ImageIcon className="text-[#FF5A7E]" /> Bosh Sahifa Rasmini O'zgartirish
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Current Image Display */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Joriy Rasm</h3>
                        <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            {loading ? (
                                <div className="flex items-center justify-center h-full text-gray-400">Yuklanmoqda...</div>
                            ) : currentHeroUrl ? (
                                <img src={currentHeroUrl} alt="Hero Banner" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <ImageIcon size={32} className="mb-2 opacity-50" />
                                    <p className="text-sm">Rasm o'rnatilmagan</p>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Bu rasm saytga kirishdagi birinchi katta ekranda ko'rinadi.</p>
                    </div>

                    {/* Upload Form */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Yangi Rasmni Yuklash</h3>
                        <form onSubmit={handleUpdateHero} className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setImageFile(e.target.files[0]);
                                        }
                                    }}
                                    className="mx-auto cursor-pointer"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting || !imageFile}
                                className="bg-[#FF5A7E] hover:bg-[#FF5A7E]/90 w-full flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>Rasm yuklanmoqda...</>
                                ) : (
                                    <><Upload size={18} /> Rasmni Saqlash va O'zgartirish</>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </Card>
        </div>
    );
}
