import { Image as ImageIcon, Tags, Package, Settings, LogOut, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { CategoryManager } from './CategoryManager';
import { ProductManager } from './ProductManager';
import { HeroManager } from './HeroManager';
import { SettingsManager } from './SettingsManager';
import { MessageManager } from './MessageManager';

interface AdminLayoutProps {
    children: React.ReactNode;
    onLogout: () => void;
}

export function AdminLayout({ children, onLogout }: AdminLayoutProps) {
    const [activeTab, setActiveTab] = useState(() => {
        const hash = window.location.hash.replace('#', '');
        const validTabs = ['hero', 'categories', 'products', 'messages', 'settings'];
        return validTabs.includes(hash) ? hash : 'messages';
    });

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            const validTabs = ['hero', 'categories', 'products', 'messages', 'settings'];
            if (validTabs.includes(hash)) {
                setActiveTab(hash);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleTabChange = (id: string) => {
        setActiveTab(id);
        window.location.hash = id;
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        onLogout();
    };

    const navItems = [
        { id: 'messages', label: 'Buyurtmalar (Xabarlar)', icon: MessageSquare },
        { id: 'hero', label: 'Bosh Sahifa Rasmi', icon: ImageIcon },
        { id: 'categories', label: 'Kategoriyalar', icon: Tags },
        { id: 'products', label: 'Mahsulotlar', icon: Package },
        { id: 'settings', label: 'Sozlamalar', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Munfa Admin</h2>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleTabChange(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${activeTab === item.id
                                    ? 'bg-[#FF5A7E]/10 text-[#FF5A7E] font-medium'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </button>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <LogOut size={20} />
                        Chiqish
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[80vh]">
                    {activeTab === 'messages' && <h1 className="text-3xl font-bold mb-6">Mijozlar Xabarlari va Buyurtmalar</h1>}
                    {activeTab === 'hero' && <h1 className="text-3xl font-bold mb-6">Bosh Sahifa Rasmi</h1>}
                    {activeTab === 'categories' && <h1 className="text-3xl font-bold mb-6">Kategoriyalar</h1>}
                    {activeTab === 'products' && <h1 className="text-3xl font-bold mb-6">Mahsulotlar</h1>}
                    {activeTab === 'settings' && <h1 className="text-3xl font-bold mb-6">Tizim Sozlamalari</h1>}

                    {/* Active Tab Content */}
                    <div className="mt-8">
                        {activeTab === 'messages' ? (
                            <MessageManager />
                        ) : activeTab === 'hero' ? (
                            <HeroManager />
                        ) : activeTab === 'categories' ? (
                            <CategoryManager />
                        ) : activeTab === 'products' ? (
                            <ProductManager />
                        ) : activeTab === 'settings' ? (
                            <SettingsManager />
                        ) : null}
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
