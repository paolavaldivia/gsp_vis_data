import numpy as np
from skimage.draw import line_aa, line
from skimage.transform import hough_line
from sklearn.preprocessing import MinMaxScaler


def dot(vA, vB):
    return vA[0]*vB[0]+vA[1]*vB[1]
def ang(lineA, lineB):
    # Get nicer vector form
    vA = [(lineA[0][0]-lineA[1][0]), (lineA[0][1]-lineA[1][1])]
    vB = [(lineB[0][0]-lineB[1][0]), (lineB[0][1]-lineB[1][1])]
    # Get dot prod
    dot_prod = dot(vA, vB)
    # Get magnitudes
    magA = dot(vA, vA)**0.5
    magB = dot(vB, vB)**0.5
    # Get cosine value
    cos_ = dot_prod/magA/magB
    # Get angle in radians and then convert to degrees
    angle = np.arccos(dot_prod/magB/magA)
    # Basically doing angle <- angle mod 360
    ang_deg = np.degrees(angle)%360

    if ang_deg-180>=0:
        # As in if statement
        return 360 - ang_deg
    else: 

        return ang_deg

   
def pair_metrics(data, ci, cj):
    n, ncols = data.shape
    size = 512
    scaler = MinMaxScaler((0, size-1))
    sc_data = np.floor(scaler.fit_transform(data))
    
#     img = np.zeros((size, size), dtype=np.float64)
    img_ = np.zeros((size, size), dtype=np.float64)
    R =np.zeros(n) 
    L =np.zeros(n) 
    D =np.zeros(n) 
    bins = [None]*(2)
    for i in range(n):
        y = sc_data[i, [ci, cj]]
        rr, cc = line(int(y[0]), 0, int(y[1]), size-1)
        img_[rr, cc] += 1
        R[i] = y[0]
        L[i] = y[1]
        D[i] = y[1] - y[0]
#         rr, cc, v = line_aa(int(y[0]), 0, int(y[1]), size-1)
#         img[rr, cc] += v
    bins[0] = img_[:,0]
    bins[1] = img_[:,-1]
    
    l_crossing = 0
    angles = []
    for i in range(n):
        for j in range(n):
            if (R[i] < R[j] and L[i] > L[j]) or (R[i] > R[j] and L[j] < L[j]):
                l_crossing += 1
                a = ang([[0, R[i]], [size, L[i]]], [[0, R[j]], [size, L[j]]])
                angles.append(a)

    H = np.zeros((size, size), dtype=np.float64)
    H = bins[0][np.newaxis].T * bins[1][np.newaxis]
        
    mutual = 0
#     convergence = 0
#     divergence = 0
    for ri in range(size):
        for rj in range(size):
            pij = H[ri, rj]/size
            pi = bins[0][ri]/size
            pj = bins[0][rj]/size    
            if  pij > 0 and pi >0  and pj > 0:
                m = pij * np.log(pij/(pi*pj))
                mutual += m

    l_c_normalized = 2*l_crossing/(size*(size-1))
    median_angles = np.nanmedian(angles)
    par_nor = (D+size)/(size*2)
    q75 = np.nanpercentile(par_nor, 75)
    q25 = np.nanpercentile(par_nor, 25)
    q50 = np.nanpercentile(D, 50)
    p_norm = 1-abs(q75-q25)
    
    overplotting = np.sum(img_[img_>1])
    over_norm = 2*overplotting/(size*(size-1))
    
    nbins = 256
    h_bins, _ = np.histogram(img_, nbins)
    p_bins = h_bins/(size*size)
    p_bins[p_bins==0] = 0.5/(size*size)
    entropy_bins = np.sum(p_bins*np.log(1/p_bins))
    
#     plt.imshow(img_, cmap='gray_r')
#     plt.show()

#     print('l_crossing', l_c_normalized)
#     print('median_angles', median_angles)
#     print('p_norm', p_norm)
#     print('mutual', mutual)
#     print('entropy', entropy_bins)
    
    return {'l_crossing': l_c_normalized,
            'median_angles': median_angles,
            'p_norm': p_norm,
            'mutual': mutual,
            'entropy': entropy_bins,
            'overplotting': over_norm}
    
def pc_metrics_(data):
    n, ncols = data.shape
    p_metrics_ = [None]*(ncols-1)
    for i in range(ncols-1):
        p_metrics_[i] = pair_metrics(data, i, i+1)
    return p_metrics_
    
def pc_metrics(data):
    p_metrics_ = pc_metrics_(data)
    n, ncols = data.shape
    metrics_ = dict()
    for key in p_metrics_[0]:
        metrics_[key] = 0
        for i in range(ncols-1):    
            metrics_[key] += p_metrics_[i][key]
        metrics_[key] /= (ncols-1)
    return metrics_