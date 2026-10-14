import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceGig, GigCategory } from '../types';
import { 
  Sparkles, 
  Presentation, 
  Palette, 
  GraduationCap, 
  MessageCircle, 
  PlusCircle, 
  Star, 
  CheckCircle, 
  Phone, 
  X,
  Scissors
} from 'lucide-react';

export const CampusGigsSection: React.FC = () => {
  const { 
    serviceGigs, 
    addServiceGig, 
    currentUser, 
    setActivePortal,
    universityInfo 
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<GigCategory | 'all'>('all');
  const [isAddGigModalOpen, setIsAddGigModalOpen] = useState(false);
  const [bookedSuccess, setBookedSuccess] = useState<string | null>(null);

  // Form states for creating a new gig
  const [gigTitle, setGigTitle] = useState('');
  const [gigCategory, setGigCategory] = useState<GigCategory>('presentation');
  const [gigPrice, setGigPrice] = useState<number | ''>('');
  const [gigPriceUnit, setGigPriceUnit] = useState('per deck / project');
  const [gigDescription, setGigDescription] = useState('');
  const [providerName, setProviderName] = useState(currentUser?.name || '');
  const [providerPhone, setProviderPhone] = useState(currentUser?.phone || '');
  const [providerHostel, setProviderHostel] = useState(currentUser?.hostelOrDept || universityInfo.hostels[0]);

  const filteredGigs = filterCategory === 'all'
    ? serviceGigs
    : serviceGigs.filter(g => g.category === filterCategory);

  const handleCreateGig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gigTitle.trim() || gigPrice === '' || !providerName.trim() || !providerPhone.trim()) return;

    await addServiceGig({
      title: gigTitle.trim(),
      category: gigCategory,
      price: Number(gigPrice),
      priceUnit: gigPriceUnit.trim() || 'per task',
      description: gigDescription.trim() || 'Experienced campus student offering top quality work.',
      providerName: providerName.trim(),
      providerPhone: providerPhone.trim(),
      college: 'Punjab University',
      hostelOrDept: providerHostel
    });

    setIsAddGigModalOpen(false);
    setGigTitle('');
    setGigPrice('');
    setGigDescription('');
    setBookedSuccess('Your student gig listing is now live across the campus!');
    setTimeout(() => setBookedSuccess(null), 3000);
  };

  const handleBookGig = (gig: ServiceGig) => {
    setBookedSuccess(`Booking request sent to ${gig.providerName}! They will coordinate with you via phone.`);
    setTimeout(() => setBookedSuccess(null), 3500);
  };

  const getCategoryIcon = (category: GigCategory) => {
    switch (category) {
      case 'presentation':
        return <Presentation className="w-4 h-4 text-violet-600" />;
      case 'graphic_design':
        return <Palette className="w-4 h-4 text-emerald-600" />;
      case 'tutoring':
        return <GraduationCap className="w-4 h-4 text-purple-600" />;
      case 'craft_workshop':
        return <Scissors className="w-4 h-4 text-rose-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Toast Notice */}
      {bookedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs border border-slate-700 animate-fade-in font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{bookedSuccess}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 mb-10 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-violet-300 mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{universityInfo.shortName} Campus Skill Exchange & Student Freelance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Experienced Student? Offer Services & Earn
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Provide case competition PPT / presentation design, society fests posters, CAD / 3D model projects, craft workshops, or 1-on-1 exam tutoring. Set your honest price and help campus peers.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddGigModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-2xl text-xs transition-colors flex items-center gap-2 shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Skill or Service</span>
            </button>

            <button
              onClick={() => setActivePortal('buyer')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-8 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Services ({serviceGigs.length})
          </button>

          <button
            onClick={() => setFilterCategory('presentation')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterCategory === 'presentation'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>PPT & Presentation</span>
          </button>

          <button
            onClick={() => setFilterCategory('graphic_design')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterCategory === 'graphic_design'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Graphic Design</span>
          </button>

          <button
            onClick={() => setFilterCategory('tutoring')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterCategory === 'tutoring'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Exam Tutoring</span>
          </button>
        </div>

        <button
          onClick={() => setIsAddGigModalOpen(true)}
          className="text-xs font-bold text-violet-700 hover:underline shrink-0 cursor-pointer"
        >
          + Add Your Gig
        </button>
      </div>

      {/* Gigs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGigs.map(gig => (
          <div
            key={gig.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:border-violet-200 hover:shadow-lg transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-100 rounded-xl">
                    {getCategoryIcon(gig.category)}
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {gig.hostelOrDept}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{gig.rating}</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    ({gig.completedGigs} gigs)
                  </span>
                </div>
              </div>

              <h3 className="text-base font-black text-slate-900 mb-2 leading-snug">
                {gig.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {gig.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Rate:</span>
                <div className="text-lg font-black text-slate-900 tabular-nums">
                  ₹{gig.price}
                  <span className="text-xs font-normal text-slate-500 ml-1">
                    /{gig.priceUnit}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-bold mt-0.5">
                  By {gig.providerName}
                </div>
              </div>

              <button
                onClick={() => handleBookGig(gig)}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Book Service
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Gig Modal */}
      {isAddGigModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Offer Student Freelance Service
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set your own rate for {universityInfo.shortName} campus peers.
                </p>
              </div>
              <button
                onClick={() => setIsAddGigModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGig} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Case Competition PPT & Pitch Deck Design"
                  value={gigTitle}
                  onChange={(e) => setGigTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={gigCategory}
                    onChange={(e) => setGigCategory(e.target.value as GigCategory)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="presentation">Presentation & PPT Design</option>
                    <option value="graphic_design">Graphic Design & Fest Posters</option>
                    <option value="tutoring">Exam & Code Tutoring</option>
                    <option value="craft_workshop">Craft Workshop / Custom Gigs</option>
                    <option value="other">Other Campus Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Rate (₹ INR)
                  </label>
                  <input
                    type="number"
                    min="10"
                    required
                    placeholder="e.g. 199"
                    value={gigPrice}
                    onChange={(e) => setGigPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none tabular-nums font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pricing Unit
                </label>
                <input
                  type="text"
                  placeholder="e.g. per 10-slide deck, per hour session"
                  value={gigPriceUnit}
                  onChange={(e) => setGigPriceUnit(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Mehra"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={providerPhone}
                    onChange={(e) => setProviderPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none font-mono tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Campus Hostel / Department
                </label>
                <select
                  value={providerHostel}
                  onChange={(e) => setProviderHostel(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none bg-white cursor-pointer"
                >
                  {universityInfo.hostels.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Service Bio & Highlights
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail your past achievements, software tools, or turnaround time..."
                  value={gigDescription}
                  onChange={(e) => setGigDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer shadow-md"
              >
                Publish Campus Gig Listing
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
