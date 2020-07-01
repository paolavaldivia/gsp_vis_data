import sys
import numpy as np
import scipy as scp
from sklearn.neighbors import kneighbors_graph
from itertools import combinations

def is_symmetric(S):
    A = S - S.T
    ids1, ids2, v = scp.sparse.find(A)
    if len(v > 1e-7) != 0:
        return(False)
    else:
        return(True)

def connected_knn(points, symmetry=True, neighbors=6, extra_neighbors=3):
    '''computes knn graph ensuring it is connected by inserting new links between the closest
       points in each component.

       Paramters:

            points: numpy array where each row corrspond to a point in a n-dimenisonal space
                    (columns are the coordinates)

            symmetry: True ensures symmetry in tha returned adjacency matrix

            neighbors: numbor of neighbors in the knn algorithm

            extra_neighbors: number of edges to be enforced between the disconnected components
                             to connect them

        Returns:

            Scipy sparse matrix
    '''

    try:
        if type(points) is not np.ndarray:
            raise TypeError()

    except TypeError:
            print('----- conneted_knn Error -----')
            print('<points> must be a Numpy Array')
            sys.exit()

    W = kneighbors_graph(points,neighbors,mode='distance')
    W = W.tolil()

    if symmetry == True:
        S = W - W.T
        ids1, ids2, v = scp.sparse.find(S)
        for i in range(v.size):
            W[ids1[i],ids2[i]] = np.abs(v[i])
            W[ids2[i],ids1[i]] = np.abs(v[i])

    components = scp.sparse.csgraph.connected_components(W)
    if components[0] > 1 and extra_neighbors != 0:
        for i in combinations(range(components[0]),2):
            ids1 = np.where(components[1] == i[0])[0]
            ids2 = np.where(components[1] == i[1])[0]
            dists = scp.spatial.distance.cdist(points[ids1],points[ids2])
            for j in range(extra_neighbors):
                id_min = np.argmin(dists)
                row = id_min//dists.shape[1]
                col = id_min - row*dists.shape[1]
                vi = ids1[row]
                vj = ids2[col]
                W[vi,vj] = dists.ravel()[id_min]
                W[vj,vi] = W[vi,vj]
                dists[row,col] = 1.e8
                #dists[col,row] = 1.e8

    if symmetry == True and is_symmetric(W) == False:
        print('WARNING !!  Something wrong happened - returning a non-symmetric matrix')

    return(W)

if __name__ == "__main__":
    import matplotlib.pyplot as plt
    import networkx as ntx

    D = np.random.multivariate_normal(np.zeros((2,)), 0.01*np.identity(2,dtype=float), 500)
    D = np.vstack((D,np.random.multivariate_normal(np.ones((2,)), 0.01*np.identity(2,dtype=float), 200)))

    A = connected_knn(D,extra_neighbors=5)

    G = ntx.from_numpy_matrix(scp.sparse.csr_matrix.todense(A))
    ntx.draw(G, D, node_size=25, node_color='blue', edge_color='lightgray')
    plt.show()
