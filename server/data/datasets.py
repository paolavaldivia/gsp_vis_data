import numpy as np
from sklearn import datasets
import csv

def load_dataset(case=0, n_samples=500, **kwargs):
    switcher = {
        0: _ds_blobs, 
        1: datasets.make_classification,
        2: _ds_2,
        3: _ds_3,
        4: _ds_bimodal,
        5: _ds_iris,
        6: _ds_eggs,
        7: _ds_cars,
        8: _ds_wine,
        9: _ds_squares2,
        10: _ds_squares3,
        11: _ds_grid,
        12: _ds_frame,
        13: _ds_diabetes,
        14: _ds_ecoli,
        15: _ds_yeast
    }
    # Get the function from switcher dictionary
    func = switcher.get(case)
    # Execute the function
    return func(n_samples=n_samples, **kwargs)

def _ds_blobs(**kwargs):
    angles_order = [0, 1, 2, 3, 4]
    f_angles_order = [0, 1, 2, 4, 3]
    sel_order = f_angles_order
    data, Y = datasets.make_blobs(**kwargs)
    col_names = list(map(str, sel_order))
    return data, Y, col_names

def _ds_class(**kwargs):
    # n_samples = kwargs.get('n_samples', 400 )
    return(datasets.make_classification(n_classes=3, n_informative=3, **kwargs))

def _ds_squares2(**kwargs):
    n_samples = kwargs.get('n_samples', 400 )
    sq_size = int(n_samples/2)
    X = np.random.rand(2, sq_size*2)
    X[0,:sq_size] += np.random.rand(sq_size)*.3 -.15
    X[0,sq_size:] += np.random.rand(sq_size)*.3 -.15 + 1.2
    X[1,:sq_size] += np.random.rand(sq_size)*.3 -.15 
    X[1,sq_size:] += np.random.rand(sq_size)*.3 -.15 + 1.2
    Y = np.ones(sq_size*2)
    Y[sq_size:] = 2
    X= X.T
    return X, Y

def _ds_squares3(**kwargs):
    n_samples = kwargs.get('n_samples', 600 )  
    n_samples = 600 
    sq_size = int(n_samples/3)
    X = np.random.rand(2, sq_size*3)
    X[0,:sq_size] += np.random.rand(sq_size)*.3 -.15
    X[1,:sq_size] += np.random.rand(sq_size)*.3 -.15 
    X[0,sq_size:sq_size*2] += np.random.rand(sq_size)*.3 -.15 + 1.2
    X[1,sq_size:sq_size*2] += np.random.rand(sq_size)*.3 -.15 + 1.2
    X[0,sq_size*2:] += np.random.rand(sq_size)*.3 -.15 + 1.4
    X[1,sq_size*2:] += np.random.rand(sq_size)*.3 -.15 - 0.4

    Y = np.ones(sq_size*3)
    Y[sq_size:sq_size*2] = 2
    Y[sq_size*2:] = 3
    X= X.T
    return X, Y

def _ds_grid(**kwargs):
    n_samples = kwargs.get('n_samples', 400 )  
    m_size = int(np.sqrt(n_samples))
    # sq_size = int(n_samples/2)
    x1, x2 = np.meshgrid(np.linspace(0,100,m_size), np.linspace(0,100,m_size))

    X = np.vstack((x1.flatten(), x2.flatten()))
    X += np.random.rand(2, m_size*m_size)*3.5
    Y = np.ones(m_size*m_size)
    X= X.T 
    return X, Y 

def _ds_frame(**kwargs):
    n_samples = kwargs.get('n_samples', 400 )  
    # m_size = int(np.sqrt(n_samples))
    m_size = int(n_samples/4)
    x1 = np.zeros(m_size*4)
    x1[m_size:m_size*2] = np.linspace(0, 100, m_size)
    x1[m_size*2:m_size*3] = np.zeros(m_size)+100
    x1[m_size*3:] = np.linspace(0, 100, m_size)

    x2 = np.zeros(m_size*4)
    x2[m_size*2:m_size*3] = np.linspace(0, 100, m_size)
    x2[m_size*3:] = np.zeros(m_size)+100
    x2[:m_size] = np.linspace(0, 100, m_size)

    X = np.vstack((x1.flatten(), x2.flatten()))
    X += np.random.rand(2, m_size*4)*4
    Y = np.ones(m_size*4)
    X= X.T 
    return X, Y 

def _ds_eggs(**kwargs):
    eggs = np.loadtxt('data/eggs_train.csv', delimiter=',')
    Y = eggs[:, 0]
    X = eggs[:, 2:]
    return X, Y


def _ds_bank(**kwargs):
    bank = np.loadtxt('data/data_banknote_authentication.txt', delimiter=',')
    Y = bank[:, -1]
    X = bank[:, 0:-1]
    col_names = ['variance', 'skewness', 'curtosis', 'entropy']
    return X, Y, col_names

def _ds_ecoli(**kwargs):
    ecoli = np.loadtxt('data/ecoli.data.txt', delimiter=',')
    Y = ecoli[:, -1]
    X = ecoli[:, [0,1,4,5,6]]
    col_names = ['mcg', 'gvh', 'aac', 'alm1', 'alm2']
    return X, Y, col_names

def _ds_yeast(**kwargs):
    yeast = np.loadtxt('data/yeast.data.txt', delimiter=',')
    Y = yeast[:, -1]
    X = yeast[:, [0,1,2,3,6,7]]
    col_names = ['mcg', 'gvh', 'alm', 'mit', 'vac', 'nuc']

    return X, Y, col_names

def _ds_cars(**kwargs):
    # cars = np.loadtxt('data/cars.csv', delimiter=',', skiprows=1)
    cars = []
    with open('data/cars.csv', 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        header = next(reader)
        for row in reader:
            # print(row[:-1])
            # print(list(map(float,row[:-1])))
            cars.append(row[:-1])
    X = np.array(cars, dtype=np.float64)
    X[np.isnan(X)] = 0
    Y = None
    return X, Y, header[:-1]

def _ds_iris(**kwargs):
    iris = datasets.load_iris()
    data = iris.data
    Y = iris.target
    col_names = ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width']
    return data, Y, col_names

def _ds_diabetes(**kwargs):
    diabetes = datasets.load_diabetes()
    data = diabetes.data
    Y = diabetes.target
    col_names = diabetes.feature_names
    return data, Y, col_names

def _ds_wine(**kwargs):
    wine = datasets.load_wine()

    low_f_overplot_order = [10,5,8,6,11,12,2,0,4,9,7,3,1]
    

    overplot_order = [4, 5, 6, 8, 10, 11, 0, 12, 9, 7, 3, 1, 2]
    f_overplot_order = [1, 3, 7, 9, 2, 0, 4, 8, 6, 5, 11, 12, 10]
    angles_order = [10, 11, 6, 5, 8, 12, 0, 9, 4, 2, 3, 1, 7]
    f_angles_order = [10, 11, 6, 5, 8, 12, 4, 0, 2, 9, 1, 7, 3]
    par_order = [1,7,3,2,4,9,0,12,10,8,5,6,11]
    f_par_order = [3,7,1,9,2,0,4,12,5,8,6,11,10]
    sel_order = low_f_overplot_order
    data = wine.data[:, sel_order]
    Y = wine.target
    col_names = [wine.feature_names[i] for i in sel_order]
    return data, Y, col_names

def _ds_2(**kwargs):
    n_samples = kwargs.get('n_samples', 500 )
    locs = kwargs.get('locs', [0] )
    scales = kwargs.get('scales', [1] )

    X = []

    for l, sc in zip(locs, scales):
        X.append(np.random.normal(l, sc, n_samples ))

    x = .3*np.random.normal(size=n_samples) + X[0]
    X.append(x)

    x = .3*np.random.normal(size=n_samples) - X[0]
    X.append(x)

    x = .3*np.random.normal(size=n_samples) - X[0]
    X.append(x)

    x = np.random.normal(size=n_samples)
    X.append(x)

    X = np.array(X)

    X = X.T

    Y = None

    return X, Y
    
def _ds_3(**kwargs):
    n_samples = kwargs.get('n_samples', 500 )
    locs = kwargs.get('locs', [0] )
    scales = kwargs.get('scales', [1] )

    X = []
    
    for l, sc in zip(locs, scales):
        X.append(np.random.normal(l, sc, n_samples))

    Y = None
    return X, Y

def _ds_bimodal(**kwargs):
    n_samples = kwargs.get('n_samples', 500 )
    locs = kwargs.get('locs', [0, 0, 5] )
    scales = kwargs.get('scales', [1, 1, 1] )

    X = []

    if len(locs) != len(scales):
        raise IndexError

    X.append(np.random.normal(locs[0], scales[0], n_samples ))

    x = .3*np.random.normal(size=n_samples) + X[0]
    X.append(x)

    x = .3*np.random.normal(size=n_samples) - X[0]
    X.append(x)

    x = .3*np.random.normal(size=n_samples) - X[0]
    X.append(x)

    n_bim_samples = int(n_samples/(len(locs) - 1))
    x = np.hstack([np.random.normal(locs[i], scales[i], n_bim_samples) for i in range(1,len(locs)) ])
    X.append(x)

    X = np.array(X)

    X = X.T

    Y = None

    return X, Y


