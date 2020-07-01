import os
from flask import Flask, request, session, redirect, render_template
from flask_cors import CORS, cross_origin
from io import BytesIO
import json

import numpy as np
import scipy as sp
import networkx as nx

from sklearn.cluster import AffinityPropagation
from sklearn.neighbors import NearestNeighbors
from sklearn import manifold, datasets, preprocessing
from sklearn import decomposition
from sklearn import metrics

import scipy.spatial as ss

import data.datasets as ds
import gsp_lib.util as gsp_util
import gsp_lib.filter as gsp_filter
import gsp_lib.filter_design as gsp_filter_design
from gsp_lib.pc_metrics import pc_metrics

app = Flask(__name__)
app.config.from_object('config')
CORS(app)

@app.route("/")
def index():
    return 'Hello world!'

def dump_data(X, Y=None, ds_type='cont', vars=None):
    if vars is None:
        vars = range(X.shape[1])
    str_vars = ','.join(list(map(str, vars)))
    if Y is not None:
        str_vars = str_vars + ',' + 'label'
    output = BytesIO()
    if Y is not None:
        np.savetxt(output, np.hstack((X, Y[np.newaxis].T)) , header=str_vars, comments='', delimiter=',')
    else:
        np.savetxt(output, X , header=str_vars, comments='', delimiter=',')
    csv_string = output.getvalue()
    return csv_string


@app.route("/dataset")
def load_data():
    str_case = request.args.get('name', 'blobs')
    n_samples = int(request.args.get('nSamples', 100))
    n_features = int(request.args.get('nFeatures', 5))
    n_classes = int(request.args.get('nClasses', 3))
    print(n_classes)
    random = request.args.get('random', None)
    kwargs = {}
    if str_case == 'blobs':
        case = 0
        kwargs = {'n_features': n_features, 'centers': n_classes, 'cluster_std': 2.3}
        if random is not None:
            kwargs['random_state'] = int(random)
        ds_type = 'class'
    elif str_case == 'classification':
        kwargs = {'n_features': n_features, 'n_clusters_per_class': 1, 'n_classes': n_classes, 'n_informative': n_features-2, 'n_redundant': 2}
        case = 1
        if random is not None:
            kwargs['random_state'] = int(random)
        ds_type = 'class'
    elif str_case == 'ds2':
        case = 2
        ds_type = 'cont'
    elif str_case == 'ds3':
        case = 3
        ds_type = 'cont'
    elif str_case == 'bimodal':
        case = 4
        ds_type = 'cont'
    elif str_case == 'iris':
        case = 5
        ds_type = 'class'
    elif str_case == 'eggs':
        case = 6
        ds_type = 'class'
    elif str_case == 'cars':
        case = 7
        ds_type = 'cont'
    elif str_case == 'wine':
        case = 8
        ds_type = 'class'
    elif str_case == 'squares2':
        case = 9
        ds_type = 'class'
    elif str_case == 'squares3':
        case = 10
        ds_type = 'class'
    elif str_case == 'grid':
        case = 11
        ds_type = 'class'
    elif str_case == 'frame':
        case = 12
        ds_type = 'class'
    elif str_case == 'diabetes':
        case = 13
        ds_type = 'class'
    elif str_case == 'ecoli':
        case = 14
        ds_type = 'class'
    elif str_case == 'yeast':
        case = 15
        ds_type = 'class'


    app.ds_type = ds_type
    dataset = ds.load_dataset(case=case, n_samples=n_samples, **kwargs)
    app.X = dataset[0]
    app.Y = dataset[1] if len(dataset) > 1 else None
    app.cols = dataset[2] if len(dataset) > 2 else None
    app.X = preprocessing.scale(app.X)

    n, d = app.X.shape
    ksamp = int(np.ceil(np.sqrt(n)))
    app.sample_ids = np.random.randint(low=0,high=n,size=(ksamp,))  # getting 100 random points in D as control points

    # if app.Y is not None:
    #     print('classes', len(np.unique(app.Y)))

    print('shape', app.X.shape)

    if str_case == 'grid':
        graph = gsp_util.get_graph2(app.X)
    else:
        n_neighbors = 3
        n_comp = None
        while n_comp != 1:
            graph = gsp_util.get_graph(app.X, n_neighbors)
            n_comp = len(list(nx.connected_components(graph['G'])))
            n_neighbors += 1
        print('n neighbors: {}'.format(n_neighbors-1))
    app.graph = graph
    app.pos = {}
    app.fpos = {}

    return dump_data(app.X, app.Y, vars=app.cols)

@app.route("/projection")
def get_layout():
    mode = request.args.get('projection', 'pca')
    app.mode = mode
    if mode not in app.pos:
        print('computing '+ mode + ' layout')
        sample_ids = None
        if mode == 'lamp':
        	sample_ids = app.sample_ids
        app.pos[mode] = gsp_util.get_layout(mode=mode, data=app.X, graph=app.graph['G'], sample_ids=sample_ids) #mode: pca, force
    return dump_data(app.pos[mode], app.Y)

@app.route("/links")
def get_links():
    return json.dumps([[str(p[0]), str(p[1])] for p in app.graph['G'].edges()])

@app.route("/smooth")
def get_smoothed_data():
	gamma = float(request.args.get('gamma', 10))
	app.fpos = {}
	if  hasattr(app, 'graph'):
		lmax = app.graph['lam'][-1]
		g_l = gsp_filter_design.smooth(gamma)
		filt = g_l(app.graph['lam'])
		app.graph['filt'] = filt
		app.pr = gsp_filter.analyze(app.X, app.graph)
	return dump_data(np.array([app.graph['lam'], filt]).T)
	return ''

@app.route("/filter")
def get_filter():
    filtName = request.args.get('filter', 'low')
    alpha = float(request.args.get('alpha', 50))
    beta = request.args.get('beta', None)
    c = float(request.args.get('c', 0.5))
    if beta is None: 
        beta = 2 if filtName == 'enhancement' else 50
    else:
        beta = float(beta)
    app.fpos = {}
    if  hasattr(app, 'graph'):
        if filtName == 'low': 
            lmax = app.graph['lam'][-1]
            g_l = gsp_filter_design.low_pass_4(lmax, alpha)
            filt = g_l(app.graph['lam'])
            app.graph['filt'] = filt
            app.pr = gsp_filter.analyze(app.X, app.graph)
            return dump_data(np.array([app.graph['lam'], filt]).T)
        elif filtName == 'high': 
            lmax = app.graph['lam'][-1]
            g_h = gsp_filter_design.high_pass_4(lmax, beta)
            filt = g_h(app.graph['lam'])
            app.graph['filt'] = filt
            app.pr = gsp_filter.analyze(app.X, app.graph)
            return dump_data(np.array([app.graph['lam'], filt]).T)
        elif filtName == 'enhancement': 
            a = c
            b = 1-a
            lmax = app.graph['lam'][-1]
            g_l = gsp_filter_design.low_pass_4(lmax, alpha)
            g_h = gsp_filter_design.high_pass_4(lmax, beta)
            filt = a * g_l(app.graph['lam']) + b *g_h(app.graph['lam'])
            app.graph['filt'] = filt
            app.pr = gsp_filter.analyze(app.X, app.graph)
            return dump_data(np.array([app.graph['lam'], filt]).T)
    return ''

@app.route("/filtered")
def get_filtered():
    return dump_data(app.pr['data_filtered'].T, app.Y, vars=app.cols)

def compute_metrics(X, Y=None):
# #############################################################################
    # Compute Affinity Propagation
    X[np.isnan(X)] = 0
    af = AffinityPropagation().fit(X)
    cluster_centers_indices = af.cluster_centers_indices_
    labels = af.labels_

    n_clusters_ = len(cluster_centers_indices)

    metrics_ = { }

    metrics_['n_clusters'] = n_clusters_
    metrics_['silhouette'] = metrics.silhouette_score(X, labels, metric='sqeuclidean')

    if Y is not None:# == 'class':
        metrics_['homogeneity'] = metrics.homogeneity_score(Y, labels)
        metrics_['completeness'] = metrics.completeness_score(Y, labels)
        metrics_['v_measure'] = metrics.v_measure_score(Y, labels)
        metrics_['adjusted_rand'] = metrics.adjusted_rand_score(Y, labels)
        metrics_['adjusted_mutual_info'] = metrics.adjusted_mutual_info_score(Y, labels)

    return metrics_

    # #############################################################################
@app.route("/metrics")
def get_metrics():
    metrics_ = {}
    metrics_['data'] = compute_metrics(app.X, app.Y)
    metrics_['data_filtered'] = compute_metrics(app.pr['data_filtered'].T, app.Y)
    metrics_['data_proj'] = compute_metrics(app.pos[app.mode], app.Y)
    metrics_['data_filtered_proj'] = compute_metrics(app.fpos[app.mode], app.Y)
    if(app.X.shape[1] < 10):
        metrics_['data_pc'] = pc_metrics(app.X)
        metrics_['data_filtered_pc'] = pc_metrics(app.pr['data_filtered'].T)
    return json.dumps(metrics_)

@app.route("/fprojection")
def get_fprojection():
    mode = request.args.get('projection', 'pca')
    if mode not in app.fpos:
        print('computing '+ mode + ' layout')
        sample_ids = None
        if mode == 'lamp':
          sample_ids = app.sample_ids
        app.fpos[mode] = gsp_util.get_layout(mode=mode, data=app.pr['data_filtered'].T, graph=app.graph['G'], sample_ids=sample_ids) #mode: pca, force
    return dump_data(app.fpos[mode], app.Y)
