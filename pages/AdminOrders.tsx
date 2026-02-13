import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface OrderItem {
    id: string;
    product_id: string;
    variant_id: string;
    quantity: number;
    unit_price: number;
    product?: {
        name: string;
    };
    variant?: {
        size: string;
    }
}

interface Order {
    id: string;
    user_id: string;
    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    total_amount: number;
    shipping_address: any;
    created_at: string;
    user?: {
        email: string;
    };
    items?: OrderItem[];
}

export const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                items:order_items (
                    id, quantity, unit_price,
                    product:products(name),
                    variant:product_variants(size)
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
            // alert('Error fetching orders');
        } else {
            setOrders(data || []);
        }
        setLoading(false);
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (error) {
            alert('Failed to update status');
        } else {
            fetchOrders();
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold uppercase tracking-wide">Orders</h2>
                <button onClick={fetchOrders} className="text-sm font-bold text-blue-600 hover:text-blue-800">
                    Refresh
                </button>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">
                                        {order.id.slice(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {/* Ideally fetch user email via join perms or store in order */}
                                        {order.user_id ? 'User ' + order.user_id.slice(0, 4) : 'Guest'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        ₱{order.total_amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-[10px] uppercase font-bold leading-5 rounded ${order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        <ul className="list-disc list-inside">
                                            {order.items?.map(item => (
                                                <li key={item.id}>
                                                    {item.quantity}x {item.product?.name} ({item.variant?.size})
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className="text-xs border-gray-300 rounded shadow-sm focus:border-black focus:ring-black"
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="PAID">Paid</option>
                                            <option value="SHIPPED">Shipped</option>
                                            <option value="DELIVERED">Delivered</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
