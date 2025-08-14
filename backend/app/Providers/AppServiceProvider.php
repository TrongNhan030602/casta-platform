<?php

namespace App\Providers;

use App\Interfaces\TagInterface;
use App\Interfaces\AuthInterface;
use App\Interfaces\PostInterface;
use App\Interfaces\UserInterface;
use App\Interfaces\MediaInterface;
use App\Repositories\TagRepository;
use App\Interfaces\ProductInterface;
use App\Interfaces\ServiceInterface;
use App\Repositories\AuthRepository;
use App\Repositories\PostRepository;
use App\Repositories\UserRepository;
use App\Interfaces\CategoryInterface;
use App\Interfaces\FeedbackInterface;
use App\Repositories\MediaRepository;
use App\Interfaces\ViolationInterface;
use App\Repositories\ProductRepository;
use App\Repositories\ServiceRepository;
use Illuminate\Support\ServiceProvider;
use App\Repositories\CategoryRepository;
use App\Repositories\CustomerRepository;
use App\Repositories\FeedbackRepository;
use App\Interfaces\NewsCategoryInterface;
use App\Repositories\ViolationRepository;
use App\Repositories\EnterpriseRepository;
use App\Interfaces\ForgotPasswordInterface;
use App\Interfaces\RentalContractInterface;
use App\Interfaces\ExhibitionMediaInterface;
use App\Interfaces\ExhibitionSpaceInterface;
use App\Interfaces\ProductStockLogInterface;
use App\Interfaces\ServiceCategoryInterface;
use App\Repositories\NewsCategoryRepository;
use App\Repositories\ForgotPasswordRepository;
use App\Repositories\RentalContractRepository;
use App\Interfaces\CustomerRepositoryInterface;
use App\Repositories\ExhibitionMediaRepository;
use App\Repositories\ExhibitionSpaceRepository;
use App\Repositories\ProductStockLogRepository;
use App\Repositories\ServiceCategoryRepository;
use App\Interfaces\ProductStockSummaryInterface;
use Illuminate\Auth\Notifications\ResetPassword;
use App\Interfaces\EnterpriseRepositoryInterface;
use App\Interfaces\ExhibitionSpaceProductInterface;
use App\Repositories\ProductStockSummaryRepository;
use App\Interfaces\ExhibitionSpaceCategoryInterface;
use App\Repositories\ExhibitionSpaceProductRepository;
use App\Repositories\ExhibitionSpaceCategoryRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AuthInterface::class, AuthRepository::class);
        $this->app->bind(ForgotPasswordInterface::class, ForgotPasswordRepository::class);
        $this->app->bind(UserInterface::class, UserRepository::class);
        $this->app->bind(EnterpriseRepositoryInterface::class, EnterpriseRepository::class);
        $this->app->bind(CustomerRepositoryInterface::class, CustomerRepository::class);
        $this->app->bind(ViolationInterface::class, ViolationRepository::class);
        $this->app->bind(ExhibitionSpaceInterface::class, ExhibitionSpaceRepository::class);
        $this->app->bind(ExhibitionSpaceCategoryInterface::class, ExhibitionSpaceCategoryRepository::class);
        $this->app->bind(ExhibitionMediaInterface::class, ExhibitionMediaRepository::class);
        $this->app->bind(RentalContractInterface::class, RentalContractRepository::class);
        $this->app->bind(ExhibitionSpaceProductInterface::class, ExhibitionSpaceProductRepository::class);
        $this->app->bind(FeedbackInterface::class, FeedbackRepository::class);
        $this->app->bind(CategoryInterface::class, CategoryRepository::class);
        $this->app->bind(ProductInterface::class, ProductRepository::class);
        $this->app->bind(ProductStockLogInterface::class, ProductStockLogRepository::class);
        $this->app->bind(ProductStockSummaryInterface::class, ProductStockSummaryRepository::class);
        $this->app->bind(NewsCategoryInterface::class, NewsCategoryRepository::class);
        $this->app->bind(ServiceCategoryInterface::class, ServiceCategoryRepository::class);
        $this->app->bind(PostInterface::class, PostRepository::class);
        $this->app->bind(ServiceInterface::class, ServiceRepository::class);
        $this->app->bind(TagInterface::class, TagRepository::class);
        $this->app->bind(MediaInterface::class, MediaRepository::class);



    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function ($user, string $token) {
            return config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . $user->email;
        });
    }
}