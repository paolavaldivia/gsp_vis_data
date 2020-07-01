
import numpy as np

def gft_features(data, graph):
    U = graph['U']
    n_features = data.shape[1]
    data_ft = [None]*n_features
    for i in range(n_features):
        data_ft[i] = np.dot(U.T, data[:,i])
    return data_ft

def filter_fd(data_ft, graph):
    filt = graph['filt']
    data_ft_filtered = np.array([np.multiply(xf, filt) for xf in data_ft])
    return data_ft_filtered

def _cluster(A, n_clusters=2, method='kmeans'):
    if method=='kmeans':
        kmeans = KMeans(n_clusters=n_clusters).fit(A)
        cl = kmeans.cluster_centers_
        lab = kmeans.labels_
                                                   
    return cl, lab

def analyze(data, graph):
    U = graph['U']
    lam = graph['lam']
    
    data_ft = gft_features(data, graph)     
    data_ft_filtered = filter_fd(data_ft, graph)

    data_filtered = np.zeros((data.shape[1], data.shape[0]))
    i=0
    for x in data_ft_filtered:
        data_filtered[i,:] = np.dot(U, x)
        i += 1

    # min_ = np.min(data, axis=0)
    # max_ = np.max(data, axis=0)

    # if np.sum(max_-min_ == 0) == 0:
    #     for j in range(data_filtered.shape[0]):
    #         X_ = data_filtered[j]
    #         X_std = (X_ - np.min(X_)) / (np.max(X_) - np.min(X_))
    #         data_filtered[j] = X_std * (max_[j] - min_[j]) + min_[j]
        
    return {'data_ft': data_ft, 'data_ft_filtered': data_ft_filtered, 'data_filtered': data_filtered}

def gsp_summarize(X, graph, f_abs=False, k=2, plot2=False):
    
    tmp_ = gsp_analyze(X, graph)
    
    Xf = tmp_['X_fourier']
    Xf_filt = tmp_['X_fourier_filt']
    proj_real = tmp_['Xff_pr_real']

    Xkm, Xkl = cluster_(Xf_filt, k)
    
    U = graph['U']

    proj = np.zeros((k,X.shape[0]))
    i=0
    for xk in Xkm:
        proj[i,:] = np.dot(U, xk)
        i += 1
    
    return {'X_fourier': Xf, 'X_fourier_filt': Xf_filt, 'Xff_pr_real': proj_real, 'Xff_cl_centers': Xkm, 'Xff_cl_labels': Xkl, 'Xff_clc_real': proj}


