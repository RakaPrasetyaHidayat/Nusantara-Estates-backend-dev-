import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../App';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user } = useAuth();

    // Jika tidak ada user (belum login)
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Jika memerlukan admin tapi user bukan admin
    if (requireAdmin && !user.isAdmin) {
        return <Navigate to="/" replace />;
    }

    // Jika semua kondisi terpenuhi, tampilkan children
    return children;
};

export default ProtectedRoute;