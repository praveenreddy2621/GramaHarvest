"use client";
import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';

import { BACKEND_API } from '@/config';

export default function CouponScroller() {
    const [coupons, setCoupons] = useState<any[]>([]);

    useEffect(() => {
        fetch(`${BACKEND_API}/api/coupons/public`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setCoupons(data);
                }
            })
            .catch(err => console.error(err));
    }, []);

    if (coupons.length === 0) return null;

    return (
        <div className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white py-3 overflow-hidden relative">
            <div className="animate-scroll flex gap-8 whitespace-nowrap">
                {/* Duplicate the coupons array to create seamless loop */}
                {[...coupons, ...coupons, ...coupons].map((coupon, index) => (
                    <div key={index} className="inline-flex items-center gap-3 px-6">
                        <Tag size={18} className="flex-shrink-0" />
                        <span className="font-bold text-lg">{coupon.code}</span>
                        <span className="text-sm opacity-90">•</span>
                        <span className="text-sm">{coupon.description}</span>
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-33.333%);
                    }
                }

                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }

                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
