import numpy as np
import networkx as nx
import time

from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import MinMaxScaler
from sklearn import decomposition, manifold
import matplotlib.pyplot as plt
from  .connected_knn import connected_knn

from lamp import lamp

def get_graph(X,  n_neighbors=5, laplacian='normalized', mode='distance'):
    # nbrs = NearestNeighbors(n_neighbors=n_neighbors+1, algorithm='auto').fit(X)
    # W = nbrs.kneighbors_graph(X, mode=mode)
    # W.eliminate_zeros() 
    # if(mode=='distance'):
    #     W.data[:] = 1/W.data

    W = connected_knn(X, n_neighbors)

    G = nx.from_scipy_sparse_matrix(W)
    print('connected components: {}'.format(len(list(nx.connected_components(G)))))

    L, lam, U = get_fourier_base(G)    
    return {'G': G, 'L': L, 'lam': lam, 'U': U}

def get_fourier_base(G, laplacian='normalized', mode='distance'):
    if laplacian == 'normalized':
        L = nx.normalized_laplacian_matrix(G, nodelist=G.nodes()).toarray()
    else:
        L = nx.laplacian_matrix(G, nodelist=G.nodes()).toarray()

    lam, U = np.linalg.eigh(L)
    return L, lam, U

def get_graph2(X, laplacian='normalized', mode='distance'):
    m_size = int(np.sqrt(X.shape[0]))
    edges = []
    rc2i = lambda a, b, s: a*s+b
    for r in range(m_size):
        for c in range(m_size):
            edge = rc2i(r, c, m_size)
            tmp = [None]*4
            if r+1<m_size: tmp[0] = rc2i(r+1, c, m_size)
            if r-1>=0: tmp[1] = rc2i(r-1, c, m_size)
            if c+1<m_size: tmp[2] = rc2i(r, c+1, m_size)
            if c-1>=0: tmp[3] = rc2i(r, c-1, m_size)
            for e in tmp:
                if e is not None: 
                    edges.append((edge, e))
    edges = list(set(edges))
    G = nx.Graph(edges)   
    L, lam, U = get_fourier_base(G)    
    return {'G': G, 'L': L, 'lam': lam, 'U': U}

def get_layout(mode='pca', **kwargs):
    if mode=='pca':
        data = kwargs.get('data')
        pca = decomposition.PCA(n_components=2)
        pca.fit(data)
        pos = pca.transform(data)
        return pos
    elif mode=='tsne':
        data = kwargs.get('data')
        pos = manifold.TSNE(n_components=2).fit_transform(data)
        return pos
    elif mode=='force':
        data = kwargs.get('data')
        pos = force.project(data)
        return pos
    elif mode=='force-graph':
        graph = kwargs.get('graph')
        pos = nx.spring_layout(graph)
        pos = np.array([pos[i] for i in range(graph.number_of_nodes())])
        return pos
    elif mode=='lamp':
        data = kwargs.get('data')
        sample_ids = kwargs.get('sample_ids', None)

        if sample_ids is None: 
            n, d = data.shape
            ksamp = int(np.ceil(np.sqrt(n)))
            sample_ids = np.random.randint(low=0,high=n,size=(ksamp,))  # getting 100 random points in D as control points
        control_points = data[sample_ids,0:2]                           # coordinates of control points
        control_points = np.hstack((control_points, sample_ids.reshape(-1,1)))  # including ids of original points as the last column of control_points
        lamp_ = lamp.Lamp(Xdata=data,control_points=control_points)
        pos = lamp_.fit()

        
        # sample_idx = np.random.permutation(n)
        # sample_idx = sample_idx[range(k)]
        # xs = data[sample_idx, :]
        # # force
        # start_time = time.time()
        # print ("Projecting samples... ")
        # ys = force.project(xs)
        # print (">> Done. Elapsed time:", time.time() - start_time, "s.")
        # # lamp
        # start_time = time.time()
        # print ("Projecting... ",)
        # pos = lamp.project(data, xs, ys)
        # print (">> Done. Elapsed time:", time.time() - start_time, "s.")

        return pos

    else:
        raise ValueError

def plot_dim_projection(Y, C, C_l, acc, title):
    plt.title(title)
    plt.scatter(Y[:,0],Y[:,1], s=acc, c=C_l)
    plt.scatter(C[:,0] ,C[:,1], s=25, c='r', alpha=.5)
    for i in range(k_dim):
        plt.annotate(i, (C[i,0],C[i,1]), color='r',horizontalalignment='right',
                verticalalignment='bottom')
    #     print('{}: {}'.format(i, np.dot(np.dot(Xf_f[i,:], graph['L']),Xf_f[i,:].T)))
    for i in range(n_dims):
        plt.annotate(i, (Y[i,0], Y[i,1]))
    plt.show()

def compute_importance(X, graph):
    n_dims = X.shape[1]
    importance = [None]*n_dims
    for i in range(n_dims):
        importance[i] = np.dot(np.dot(X[:,i].T, graph['L']), X[:,i])
    #     print('{}: {}'.format(i, acc[i]))
    importance = (100*(1-importance/max(importance)))+10
    return importance

def pca_filtered_dimensions(Xff, Cff):
#     nc = Xff.shape[0]
    pca_f = decomposition.PCA(n_components=2)
    pca_f.fit(Xff)
    Yp_f = pca_f.transform(Xff)
    Cp_f = pca_f.transform(Cff)
    return Yp_f, Cp_f

def plot_projection(Y, acc=None, title=None):
    if acc is None:
        acc = 10
    plt.title(title)
    plt.scatter(Y[:,0],Y[:,1], s=acc)
    for i in range(n_dims):
        plt.annotate(i, (Y[i,0], Y[i,1]))
    plt.show()

def pca_2d(X):
    pcad = decomposition.PCA(n_components=2)
    pcad.fit(X.T)
    Yp = pcad.transform(X.T)
    return Yp

def plot_features_and_fourier(gsp_analysis, graph, data, pos, s=10, order=None):
    Xf = np.array(gsp_analysis['data_ft'])
    Xf_f = gsp_analysis['data_ft_filtered']
    lam = graph['lam']
   
    size = s

    n_features = Xf.shape[0]
    if order is None:
        feature_ord = range(n_features)
    else:
        feature_ord =order

    for dim in feature_ord:
        if type(s) is not int:
            size = s[dim,:]
        tmp_ = np.dot(graph['U'], Xf_f[dim])
        print("{}".format(dim))
        fig = plt.figure(figsize=(12,5))
    #     plt.title("{}".format(dim))
        ax1 = fig.add_subplot(131)
        ax3 = fig.add_subplot(132)
        ax2 = fig.add_subplot(133)
        nx.draw_networkx_edges(graph['G'], pos=pos, edge_color='#dddddd', ax=ax1)
        nx.draw_networkx_edges(graph['G'], pos=pos, edge_color='#dddddd', ax=ax3)
        sc = ax1.scatter(pos[:,0], pos[:,1], c=data[:,dim], s=size)
        sc = ax3.scatter(pos[:,0], pos[:,1], c=tmp_, s=size)
        ax2.plot(lam, (Xf[dim]), alpha=0.7, linewidth=1)
        ax2.plot(lam, (Xf_f[dim]), alpha=0.7, linewidth=1)
        cbar = fig.colorbar(sc)
        plt.show()

def plot_features_and_freq(graph, data, pos, c, cmap,  s=10, order=None):

    smin = 5 
    smax = 50

    data = MinMaxScaler(feature_range=(smin, smax)).fit_transform(data)
    s = MinMaxScaler(feature_range=(smin, smax)).fit_transform(s)


    n_features = data.shape[0]
    if order is None:
        feature_ord = range(n_features)
    else:
        feature_ord =order

    for dim in feature_ord:
        if type(s) is not int:
            size = s[:,dim]
        print("{}".format(dim))
        fig = plt.figure(figsize=(12,5))
    #     plt.title("{}".format(dim))
        ax1 = fig.add_subplot(121)
        ax3 = fig.add_subplot(122)
        nx.draw_networkx_edges(graph['G'], pos=pos, edge_color='#dddddd', ax=ax1)
        nx.draw_networkx_edges(graph['G'], pos=pos, edge_color='#dddddd', ax=ax3)
        sc = ax1.scatter(pos[:,0], pos[:,1], c=c, s=size, cmap=cmap)
        sc = ax3.scatter(pos[:,0], pos[:,1], c=c, s=data[:,dim], cmap=cmap)
        cbar = fig.colorbar(sc)
        plt.show()

def plot_filter(graph):
    fig = plt.figure(figsize=(10,5))
    plt.plot(graph['lam'], graph['filt'], linewidth=1)
    # plt.plot(lam, np.zeros((lam.size,)), marker='x', markersize=1, alpha=0.7, color='red')
    plt.show()


def parallel_coordinates(frame, cols=None, ax=None, color=None,
                     use_columns=False, xticks=None, colormap=None,
                     **kwds):

    n = len(frame)
    # class_col = frame[class_column]
    # class_min = np.amin(class_col)
    # class_max = np.amax(class_col)

    if cols is None:
        df = frame#.drop(class_column, axis=1)
    else:
        df = frame[cols]

    used_legends = set([])

    ncols = len(df.columns)

    # determine values to use for xticks
    if use_columns is True:
        if not np.all(np.isreal(list(df.columns))):
            raise ValueError('Columns must be numeric to be used as xticks')
        x = df.columns
    elif xticks is not None:
        if not np.all(np.isreal(xticks)):
            raise ValueError('xticks specified must be numeric')
        elif len(xticks) != ncols:
            raise ValueError('Length of xticks must match number of columns')
        x = xticks
    else:
        x = range(ncols)

    # fig = plt.figure()
    ax = plt.gca()

    # Colorm = plt.get_cmap(colormap)

    for i in range(n):
        y = df.iloc[i].values
        # kls = class_col.iat[i]
        ax.plot(x, y, color=color, **kwds)

    for i in x:
        ax.axvline(i, linewidth=1, color='black')

    ax.set_xticks(x)
    ax.set_xticklabels(df.columns)
    ax.set_xlim(x[0], x[-1])
    # ax.legend(loc='upper right')
    ax.grid()

    # bounds = np.linspace(class_min,class_max,10)
    # cax,_ = mpl.colorbar.make_axes(ax)
    # cb = mpl.colorbar.ColorbarBase(cax, cmap=Colorm, spacing='proportional', format='%.2f')

    return ax
