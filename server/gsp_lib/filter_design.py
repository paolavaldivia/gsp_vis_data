import numpy as np

def ideal(x, cut):
    f = np.zeros(x.shape)
    f[x<cut] = 1
    return f

def low_pass_0(cut):
    g = lambda x: ideal(x, cut)
    return g

def smooth(gamma=10):
    g = lambda x:  1/(1+gamma*x)
    return g

def low_pass_1(alpha=10):
    g = lambda x:  1/(1+alpha*x)
    return g

def low_pass_2(lmax, tau=20):
    g = lambda x: np.exp(-tau*x/lmax)
    return g

def high_pass_2(lmax, tau=20):
    g = lambda x: 1-np.exp(-tau*x/lmax)
    return g

def low_pass_4(lmax, alpha=20):
    g = lambda x:  np.exp(-(alpha*x/(2*lmax))**2)
    return g

def high_pass_4(lmax, alpha=20):
    g = lambda x:  1-np.exp(-(alpha*x/(2*lmax))**2)
    return g

def step(x, a):
    mc = (x>=-1) & (x<=1)
    f = np.zeros(x.shape)
    f[mc] = np.exp(-a/x[mc])/(np.exp(-a/x[mc])+np.exp(-a/(1-x[mc])))
    f[x>1] = 1
    return f
