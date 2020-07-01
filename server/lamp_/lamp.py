"""
LAMP
"""

import numpy as np

tol = 1.e-6    # zero tolerance

def project(x, xs, ys):
    """
    Projection
    """
    assert (type(x) is np.ndarray) and (type(xs) is np.ndarray) and (type(ys) is np.ndarray), \
        "*** ERROR (Force-Scheme): project input must be numpy.array type."

    ninst, dim = x.shape    # number os instances, data dimension
    k, a = xs.shape         # number os sample instances
    p = ys.shape[1]         # visual space dimension
    
    assert dim == a, "*** LAMP Error: x and xs dimensions must be egual."

    Y = np.zeros((ninst, p))

    sqnorm = lambda x: (x * x).sum(axis=1)

    for pt in range(ninst):
        # computes alphas
        alpha = np.zeros(k)
        xsxpt = xs - x[pt]
        nxspt = sqnorm(xsxpt) #np.linalg.norm(xsxpt, axis=1)**2
        alpha = 1 / nxspt
        alpha[nxspt < tol] = np.finfo(float).max
        
        # computes x~ and y~ (eq 3)
        sumAlpha = sum(alpha)
        xtilde = np.dot(alpha,xs)
        ytilde = np.dot(alpha,ys)

        xtilde /= sumAlpha
        ytilde /= sumAlpha

        sqrtAlpha = np.sqrt(alpha)
        xhat = xs - xtilde
        yhat = ys - ytilde
        
        A = np.zeros((k, dim))
        B = np.zeros((k, p))
        for j in range(dim):
            A[:,j] = sqrtAlpha*xhat[:,j]
        for j in range(p):
            B[:,j] = sqrtAlpha*yhat[:,j]
    
        U, D, V = np.linalg.svd(np.dot(A.T, B)) # (eq 7)
        # VV is the matrix V filled with zeros
        VV = np.zeros((dim, p))
        VV[:p,:p] = V

        M = np.dot(U, VV) # (eq 7)

        Y[pt] = np.dot(x[pt] - xtilde, M) + ytilde # (eq 8)

    return Y
    


